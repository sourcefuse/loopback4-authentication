import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import * as GoogleStrategy from 'passport-google-oauth20';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthUser} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

export interface GoogleAuthStrategyFactory {
  (
    options:
      | GoogleStrategy.StrategyOptions
      | GoogleStrategy.StrategyOptionsWithRequest,
  ): GoogleStrategy.Strategy;
}

export class GoogleAuthStrategyFactoryProvider
  implements Provider<GoogleAuthStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER)
    private readonly verifierGoogleAuth: VerifyFunction.GoogleAuthFn,
  ) {}

  value(): GoogleAuthStrategyFactory {
    return options => this.getGoogleAuthStrategyVerifier(options);
  }

  getGoogleAuthStrategyVerifier(
    options:
      | GoogleStrategy.StrategyOptions
      | GoogleStrategy.StrategyOptionsWithRequest,
  ): GoogleStrategy.Strategy {
    if (options && options.passReqToCallback === true) {
      return new GoogleStrategy.Strategy(
        options,
        async (
          req: Request,
          accessToken: string,
          refreshToken: string,
          profile: GoogleStrategy.Profile,
          cb: (err: Error | null, user?: IAuthUser | undefined) => void,
        ) => {
          try {
            const user = await this.verifierGoogleAuth(
              accessToken,
              refreshToken,
              profile,
              req,
            );
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else {
      return new GoogleStrategy.Strategy(
        options,
        async (
          accessToken: string,
          refreshToken: string,
          profile: GoogleStrategy.Profile,
          cb: (err: Error | null, user?: IAuthUser | undefined) => void,
        ) => {
          try {
            const user = await this.verifierGoogleAuth(
              accessToken,
              refreshToken,
              profile,
            );
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    }
  }
}
