import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as PassportBearer from 'passport-http-bearer';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthUser} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
import {isEmpty} from 'lodash';

export type BearerStrategyFactory = (
  options?: PassportBearer.IStrategyOptions,
  verifierPassed?: VerifyFunction.BearerFn,
) => PassportBearer.Strategy<VerifyFunction.BearerFn>;

export class BearerStrategyFactoryProvider
  implements Provider<BearerStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.BEARER_TOKEN_VERIFIER)
    private readonly verifierBearer: VerifyFunction.BearerFn,
  ) {}

  value(): BearerStrategyFactory {
    return (options, verifier) =>
      this.getBearerStrategyVerifier(options, verifier);
  }

  getBearerStrategyVerifierWithRequest(verifyFn: VerifyFunction.BearerFn) {
    return async (
      req: Request,
      token: string,
      cb: (err: Error | null, user?: IAuthUser | false) => void,
    ) => {
      try {
        const user = await verifyFn(token, req);
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
        }
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    };
  }

  getBearerStrategyVerifierWithoutRequest(verifyFn: VerifyFunction.BearerFn) {
    return async (
      token: string,
      cb: (err: Error | null, user?: IAuthUser | false) => void,
    ) => {
      try {
        const user = await verifyFn(token);
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
        }
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    };
  }
  getBearerStrategyVerifierDefault(
    verifyFn: VerifyFunction.BearerFn,
  ): PassportBearer.Strategy<VerifyFunction.BearerFn> {
    return new PassportBearer.Strategy(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (
        token: string,
        cb: (err: Error | null, user?: IAuthUser | false) => void,
      ) => {
        try {
          const user = await verifyFn(token);
          if (!user) {
            throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
          }
          cb(null, user);
        } catch (err) {
          cb(err);
        }
      },
    );
  }
  getBearerStrategyVerifier(
    options?: PassportBearer.IStrategyOptions,
    verifierPassed?: VerifyFunction.BearerFn,
  ): PassportBearer.Strategy<VerifyFunction.BearerFn> {
    const verifyFn = verifierPassed ?? this.verifierBearer;
    if (options?.passReqToCallback) {
      return new PassportBearer.Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.getBearerStrategyVerifierWithRequest(verifyFn),
      );
    } else if (!!options && !isEmpty(options)) {
      return new PassportBearer.Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.getBearerStrategyVerifierWithoutRequest(verifyFn),
      );
    } else {
      return this.getBearerStrategyVerifierDefault(verifyFn);
    }
  }
}
