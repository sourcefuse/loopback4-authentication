import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
//import {HttpsProxyAgent} from 'https-proxy-agent';

import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {Keycloak, VerifyFunction} from '../../types';
import {KecloackOptions, KeycloakStrategy, Profile} from './keycloak';

export interface KeycloakStrategyFactory {
  (
    options: Keycloak.StrategyOptions,
    verifierPassed?: VerifyFunction.KeycloakAuthFn,
  ): KeycloakStrategy;
}

export class KeycloakStrategyFactoryProvider
  implements Provider<KeycloakStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.KEYCLOAK_VERIFIER)
    private readonly verifierKeycloak: VerifyFunction.KeycloakAuthFn,
  ) {}

  value(): KeycloakStrategyFactory {
    return (options, verifier) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.getKeycloakAuthStrategyVerifier(options, verifier) as any; //NOSONAR
  }

  getKeycloakAuthStrategyVerifier(
    options: KecloackOptions,
    verifierPassed?: VerifyFunction.KeycloakAuthFn,
  ): KeycloakStrategy {
    const verifyFn = verifierPassed ?? this.verifierKeycloak;
    const strategy = new KeycloakStrategy(
      options,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        cb: Keycloak.VerifyCallback,
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
    return strategy;
  }
  // private _setupProxy(strategy: typeof KeycloakStrategy) {
  //   // Setup proxy if any
  //   let httpsProxyAgent;
  //   if (process.env['https_proxy']) {
  //     httpsProxyAgent = new HttpsProxyAgent(process.env['https_proxy']);
  //     strategy._oauth2.setAgent(httpsProxyAgent);
  //   } else if (process.env['HTTPS_PROXY']) {
  //     httpsProxyAgent = new HttpsProxyAgent(process.env['HTTPS_PROXY']);
  //     strategy._oauth2.setAgent(httpsProxyAgent);
  //   }
  // }
}
