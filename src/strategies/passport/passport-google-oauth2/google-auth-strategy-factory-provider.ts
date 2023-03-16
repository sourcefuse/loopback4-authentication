import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {
  Profile,
  Strategy,
  StrategyOptions,
  StrategyOptionsWithRequest,
  VerifyCallback,
} from 'passport-google-oauth20';

import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

export interface GoogleAuthStrategyFactory {
  (
    options: StrategyOptions | StrategyOptionsWithRequest,
    verifierPassed?: VerifyFunction.GoogleAuthFn,
  ): Strategy;
}

export class GoogleAuthStrategyFactoryProvider
  implements Provider<GoogleAuthStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER)
    private readonly verifierGoogleAuth: VerifyFunction.GoogleAuthFn,
  ) {}

  value(): GoogleAuthStrategyFactory {
    return (options, verifier) =>
      this.getGoogleAuthStrategyVerifier(options, verifier);
  }

  getGoogleAuthStrategyVerifier(
    options: StrategyOptions | StrategyOptionsWithRequest,
    verifierPassed?: VerifyFunction.GoogleAuthFn,
  ): Strategy {
    const verifyFn = verifierPassed ?? this.verifierGoogleAuth;
    const func=async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: VerifyCallback,
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
    };
    let strategy;
    if (options && options.passReqToCallback === true) {
      strategy = new Strategy(
        options,
        func
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ,
      );
    } else {
      strategy = new Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          cb: VerifyCallback,
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
    else{
      //this is intentional
    }
  }
}
