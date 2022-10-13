import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {Cognito, VerifyFunction} from '../../types';

const CognitoStrategy = require('passport-cognito-oauth2');

export interface CognitoAuthStrategyFactory {
  (
    options: Cognito.StrategyOptions,
    verifierPassed?: VerifyFunction.CognitoAuthFn,
  ): typeof CognitoStrategy;
}

export class CognitoStrategyFactoryProvider
  implements Provider<CognitoAuthStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.COGNITO_OAUTH2_VERIFIER)
    private readonly verifierCognito: VerifyFunction.CognitoAuthFn,
  ) {}

  value(): CognitoAuthStrategyFactory {
    return (options, verifier) =>
      this.getCognitoAuthStrategyVerifier(options, verifier);
  }

  getCognitoAuthStrategyVerifier(
    options: Cognito.StrategyOptions,
    verifierPassed?: VerifyFunction.CognitoAuthFn,
  ): typeof CognitoStrategy {
    const verifyFn = verifierPassed ?? this.verifierCognito;
    let strategy;
    if (options && options.passReqToCallback === true) {
      strategy = new CognitoStrategy(
        options,

        async (
          req: Request,
          accessToken: string,
          refreshToken: string,
          profile: Cognito.Profile,
          cb: Cognito.VerifyCallback,
        ) => {
          try {
            const user = await verifyFn(
              accessToken,
              refreshToken,
              profile,
              cb,
              req,
            );
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(undefined, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else {
      strategy = new CognitoStrategy(
        options,
        async (
          accessToken: string,
          refreshToken: string,
          profile: Cognito.Profile,
          cb: Cognito.VerifyCallback,
        ) => {
          try {
            const user = await verifyFn(accessToken, refreshToken, profile, cb);
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(undefined, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    }

    this._setupProxy(strategy);
    return strategy;
  }

  private _setupProxy(strategy: typeof CognitoStrategy) {
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
