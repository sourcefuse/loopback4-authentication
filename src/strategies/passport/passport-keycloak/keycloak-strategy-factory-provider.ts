import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {HttpsProxyAgent} from 'https-proxy-agent';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthUser} from '../../../types';
import {Strategies} from '../../keys';
import {KeycloakProfile, VerifyFunction} from '../../types';

export const KeycloakStrategy = require('@exlinc/keycloak-passport');

export interface KeycloakStrategyFactory {
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any,
    verifierPassed?: VerifyFunction.KeycloakAuthFn,
  ): typeof KeycloakStrategy;
}

export class KeycloakStrategyFactoryProvider
  implements Provider<KeycloakStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.KEYCLOAK_VERIFIER)
    private readonly verifierKeycloak: VerifyFunction.KeycloakAuthFn,
  ) {}

  value(): KeycloakStrategyFactory {
    return (options, verifier) =>
      this.getKeycloakAuthStrategyVerifier(options, verifier);
  }

  getKeycloakAuthStrategyVerifier(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any,
    verifierPassed?: VerifyFunction.KeycloakAuthFn,
  ): typeof KeycloakStrategy {
    const verifyFn = verifierPassed ?? this.verifierKeycloak;
    const strategy = new KeycloakStrategy(
      options,
      async (
        accessToken: string,
        refreshToken: string,
        profile: KeycloakProfile,
        cb: (err?: string | Error, user?: IAuthUser) => void,
      ) => {
        try {
          const user = await verifyFn(accessToken, refreshToken, profile, cb);
          if (!user) {
            throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
          }
          cb(undefined, user);
        } catch (err) {
          cb(err);
        }
      },
    );

    // Override user profile fn of underlying library
    strategy.userProfile = (
      accessToken: string,
      done: (err: unknown, userInfo?: unknown) => void,
    ) => {
      this._userProfileFn(strategy, accessToken, done);
    };

    this._setupProxy(strategy);
    return strategy;
  }

  private _userProfileFn(
    strategy: typeof KeycloakStrategy,
    accessToken: string,
    done: (err: unknown, userInfo?: KeycloakProfile) => void,
  ) {
    // Credits - https://github.com/exlinc/keycloak-passport/blob/eaa3859f83619d8e349e87193fdf8acc3a3d0ba9/index.js#L28
    strategy._oauth2._useAuthorizationHeaderForGET = true;
    strategy._oauth2.get(
      strategy.options.userInfoURL,
      accessToken,
      (err: unknown, body: string) => {
        if (err) {
          return done(err);
        }

        try {
          const json = JSON.parse(body);
          const email = json.email;
          const userInfo: KeycloakProfile = {
            keycloakId: json.sub,
            fullName: json.name,
            firstName: json.given_name,
            lastName: json.family_name,
            username: json.preferred_username,
            email,
            avatar: json.avatar,
            realm: strategy.options.realm,
            // add all attributes to userInfo
            // overridden stuff
            ...json,
          };

          done(null, userInfo);
        } catch (e) {
          done(e);
        }
      },
    );
  }

  private _setupProxy(strategy: typeof KeycloakStrategy) {
    // Setup proxy if any
    let httpsProxyAgent;
    if (process.env['https_proxy']) {
      httpsProxyAgent = new HttpsProxyAgent(process.env['https_proxy']);
      strategy._oauth2.setAgent(httpsProxyAgent);
    } else if (process.env['HTTPS_PROXY']) {
      httpsProxyAgent = new HttpsProxyAgent(process.env['HTTPS_PROXY']);
      strategy._oauth2.setAgent(httpsProxyAgent);
    }
  }
}
