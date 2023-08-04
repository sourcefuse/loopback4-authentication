import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';

import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
import {
  IProfile,
  VerifyCallback,
  OIDCStrategy,
  IOIDCStrategyOptionWithRequest,
  IOIDCStrategyOptionWithoutRequest,
} from 'passport-azure-ad';

export type AzureADAuthStrategyFactory = (
  options: IOIDCStrategyOptionWithoutRequest | IOIDCStrategyOptionWithRequest,
  verifierPassed?: VerifyFunction.AzureADAuthFn,
) => OIDCStrategy;

export class AzureADAuthStrategyFactoryProvider
  implements Provider<AzureADAuthStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.AZURE_AD_VERIFIER)
    private readonly verifierAzureADAuth: VerifyFunction.AzureADAuthFn,
  ) {}

  value(): AzureADAuthStrategyFactory {
    return (options, verifier) =>
      this.getAzureADAuthStrategyVerifier(options, verifier);
  }
  createCallbackWithReq(verifyFn: VerifyFunction.AzureADAuthFn) {
    return async (
      req: Request,
      iss: string,
      sub: string,
      profile: IProfile,
      accessToken: string,
      refreshToken: string,
      done: VerifyCallback,
    ) => {
      if (!profile.oid) {
        return done(new Error('No oid found'), null);
      }

      try {
        const user = await verifyFn(
          accessToken,
          refreshToken,
          profile,
          done,
          req,
        );
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    };
  }
  createCallbackWithoutReq(verifyFn: VerifyFunction.AzureADAuthFn) {
    return async (
      iss: string,
      sub: string,
      profile: IProfile,
      accessToken: string,
      refreshToken: string,
      done: VerifyCallback,
    ) => {
      if (!profile.oid) {
        return done(new Error('No oid found'), null);
      }

      try {
        const user = await verifyFn(accessToken, refreshToken, profile, done);
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    };
  }

  getAzureADAuthStrategyVerifier(
    options: IOIDCStrategyOptionWithoutRequest | IOIDCStrategyOptionWithRequest,
    verifierPassed?: VerifyFunction.AzureADAuthFn,
  ): OIDCStrategy {
    const verifyFn = verifierPassed ?? this.verifierAzureADAuth;
    if (options && options.passReqToCallback === true) {
      return new OIDCStrategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.createCallbackWithReq(verifyFn),
      );
    } else if (options && options.passReqToCallback === false) {
      return new OIDCStrategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.createCallbackWithoutReq(verifyFn),
      );
    } else {
      throw new Error('Invalid value for passReqToCallback');
    }
  }
}
