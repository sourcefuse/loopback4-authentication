import {Provider, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Strategies} from '../../../keys';
import {VerifyFunction} from '../../../types';
import {AuthErrorKeys} from '../../../error-keys';
import {Auth0} from '../../types';
import {
  ExtraVerificationParams,
  Profile,
  Strategy,
  StrategyOptionWithRequest,
} from 'passport-auth0';
import {Request} from 'express';

export type Auth0StrategyFactory = (
  options: Auth0.Auth0StrategyOptions | StrategyOptionWithRequest,
  verifierPassed?: VerifyFunction.Auth0Fn,
) => Strategy;

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
    options: Auth0.Auth0StrategyOptions | StrategyOptionWithRequest,
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
          cb: Auth0.VerifyCallback,
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
          cb: Auth0.VerifyCallback,
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
