import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import * as PassportBearer from 'passport-http-bearer';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthUser} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
import {isEmpty} from 'lodash';

export interface BearerStrategyFactory {
  (options?: PassportBearer.IStrategyOptions): PassportBearer.Strategy;
}

export class BearerStrategyFactoryProvider
  implements Provider<BearerStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.BEARER_TOKEN_VERIFIER)
    private readonly verifierBearer: VerifyFunction.BearerFn,
  ) {}

  value(): BearerStrategyFactory {
    return (options) => this.getBearerStrategyVerifier(options);
  }

  getBearerStrategyVerifier(
    options?: PassportBearer.IStrategyOptions,
  ): PassportBearer.Strategy {
    if (options?.passReqToCallback) {
      return new PassportBearer.Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          req: Request,
          token: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await this.verifierBearer(token, req);
            if (!user) {
              throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
            }
            cb(null, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else if (!!options && !isEmpty(options)) {
      return new PassportBearer.Strategy(
        options,

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          token: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await this.verifierBearer(token);
            if (!user) {
              throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
            }
            cb(null, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else {
      return new PassportBearer.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          token: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await this.verifierBearer(token);
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
