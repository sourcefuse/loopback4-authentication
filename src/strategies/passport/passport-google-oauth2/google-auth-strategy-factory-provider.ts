import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';

//import * as GoogleStrategy from 'passport-google-oauth20';
import {
  Strategy,
  StrategyOptions,
  StrategyOptionsWithRequest,
  Profile,
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
  implements Provider<GoogleAuthStrategyFactory> {
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
    if (options && options.passReqToCallback === true) {
      return new Strategy(
        options,

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
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
        },
      );
    } else {
      return new Strategy(
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
  }
}
