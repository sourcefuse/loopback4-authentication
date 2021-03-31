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

    this._setupProxy(strategy);
    return strategy;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _setupProxy(strategy: any) {
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
