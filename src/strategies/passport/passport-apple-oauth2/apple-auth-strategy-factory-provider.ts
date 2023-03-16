import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {AnyObject} from '@loopback/repository';

import {
  Profile,
  AuthenticateOptions,
  AuthenticateOptionsWithRequest,
  VerifyCallback,
  Strategy,
} from 'passport-apple';

import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

export interface AppleAuthStrategyFactory {
  (
    options: AuthenticateOptions | AuthenticateOptionsWithRequest,
    verifierPassed?: VerifyFunction.AppleAuthFn,
  ): Strategy;
}

export class AppleAuthStrategyFactoryProvider
  implements Provider<AppleAuthStrategyFactory>
{
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
    const appleAuthStrategy = async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      decodedIdToken: string,
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
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        cb(undefined, user);
      } catch (err) {
        cb(err);
      }
    };
    if (options && options.passReqToCallback === true) {
      strategy = new Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        appleAuthStrategy,
      );
    } else {
      strategy = new Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          accessToken: string,
          refreshToken: string,
          decodedIdToken: string,
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

  private _setupProxy(strategy: AnyObject) {
    // Setup proxy if any
    let httpsProxyAgent;
    if (process.env['https_proxy']) {
      httpsProxyAgent = new HttpsProxyAgent(process.env['https_proxy']);
      strategy._oauth2.setAgent(httpsProxyAgent);
    } else if (process.env['HTTPS_PROXY']) {
      httpsProxyAgent = new HttpsProxyAgent(process.env['HTTPS_PROXY']);
      strategy._oauth2.setAgent(httpsProxyAgent);
    } else {
      //this is intentional
    }
  }
}
