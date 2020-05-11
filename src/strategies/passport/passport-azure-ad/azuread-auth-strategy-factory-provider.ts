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

export interface AzureADAuthStrategyFactory {
  (
    options: IOIDCStrategyOptionWithoutRequest | IOIDCStrategyOptionWithRequest,
  ): OIDCStrategy;
}

export class AzureADAuthStrategyFactoryProvider
  implements Provider<AzureADAuthStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.AZURE_AD_VERIFIER)
    private readonly verifierAzureADAuth: VerifyFunction.AzureADAuthFn,
  ) {}

  value(): AzureADAuthStrategyFactory {
    return (options) => this.getAzureADAuthStrategyVerifier(options);
  }

  getAzureADAuthStrategyVerifier(
    options: IOIDCStrategyOptionWithoutRequest | IOIDCStrategyOptionWithRequest,
  ): OIDCStrategy {
    if (options && options.passReqToCallback === true) {
      return new OIDCStrategy(
        options,

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (req: Request, profile: IProfile, done: VerifyCallback) => {
          if (!profile.oid) {
            return done(new Error('No oid found'), null);
          }

          try {
            const user = await this.verifierAzureADAuth(profile, done, req);
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            done(null, user);
          } catch (err) {
            done(err);
          }
        },
      );
    } else {
      return new OIDCStrategy(
        options,

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (profile: IProfile, done: VerifyCallback) => {
          if (!profile.oid) {
            return done(new Error('No oid found'), null);
          }

          try {
            const user = await this.verifierAzureADAuth(profile, done);
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            done(null, user);
          } catch (err) {
            done(err);
          }
        },
      );
    }
  }
}
