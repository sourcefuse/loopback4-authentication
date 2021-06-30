/* eslint-disable @typescript-eslint/naming-convention */
import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {
  Profile,
  AuthenticateOptions,
  AuthenticateOptionsWithRequest,
  VerifyCallback,
  DecodedIdToken,
} from 'passport-apple';

import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

import Strategy from 'passport-apple';

//import * as AppleStrategy from 'passport-apple';
export interface AppleAuthStrategyFactory {
  (
    options: AuthenticateOptions | AuthenticateOptionsWithRequest,
    verifierPassed?: VerifyFunction.AppleAuthFn,
  ): Strategy;
}

export class AppleAuthStrategyFactoryProvider
  implements Provider<AppleAuthStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.APPLE_OAUTH2_VERIFIER)
    private readonly verifierAppleAuth: VerifyFunction.AppleAuthFn,
  ) {}

  value(): AppleAuthStrategyFactory {
    return (options, verifier) =>
      this.getAppleAuthStrategyVerifier(options, verifier);
  }

  getAppleAuthStrategyVerifier(
    options: AuthenticateOptions | AuthenticateOptionsWithRequest,
    verifierPassed?: VerifyFunction.AppleAuthFn,
  ): Strategy {
    const verifyFn = verifierPassed ?? this.verifierAppleAuth;
    let strategy;
    if (options && options.passReqToCallback === true) {
      strategy = new Strategy(
        options,

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          req: Request,
          accessToken: string,
          refreshToken: string,
          decodedIdToken: DecodedIdToken,
          profile: Profile,
          cb: VerifyCallback,
        ) => {
          try {
            const user = await verifyFn(
              accessToken,
              refreshToken,
              decodedIdToken,
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
      strategy = new Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          accessToken: string,
          refreshToken: string,
          decodedIdToken: DecodedIdToken,
          profile: Profile,
          cb: VerifyCallback,
        ) => {
          try {
            const user = await verifyFn(
              accessToken,
              refreshToken,
              decodedIdToken,
              profile,
              cb,
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
  }
}
