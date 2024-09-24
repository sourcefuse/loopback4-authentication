import {Provider, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Strategies} from '../../../keys';
import {VerifyFunction} from '../../../types';
import {AuthErrorKeys} from '../../../error-keys';
import {
  ExtraVerificationParams,
  Profile,
  Strategy,
  StrategyOption,
  StrategyOptionWithRequest,
} from 'passport-auth0';
import {Request} from 'express';

export interface Auth0StrategyOptions extends StrategyOption {
  passReqToCallback?: false | undefined;
}
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type VerifyCallback = (err?: any, user?: any, info?: any) => void;

export interface Auth0StrategyFactory {
  (
    options: Auth0StrategyOptions | StrategyOptionWithRequest,
    verifierPassed?: VerifyFunction.Auth0Fn,
  ): Strategy;
}

export class Auth0StrategyFactoryProvider
  implements Provider<Auth0StrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.AUTH0_VERIFIER)
    private readonly auth0Verifier: VerifyFunction.Auth0Fn,
  ) {}

  value(): Auth0StrategyFactory {
    return (options, verifier) => this.getAuth0Strategy(options, verifier);
  }

  getAuth0Strategy(
    options: Auth0StrategyOptions | StrategyOptionWithRequest,
    verifier?: VerifyFunction.Auth0Fn,
  ): Strategy {
    const verifyFn = verifier ?? this.auth0Verifier;
    let strategy;
    if (options?.passReqToCallback === true) {
      strategy = new Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          req: Request,
          accessToken: string,
          refreshToken: string,
          extraParams: ExtraVerificationParams,
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
      strategy = new Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          accessToken: string,
          refreshToken: string,
          extraParams: ExtraVerificationParams,
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
    return strategy;
  }
}
