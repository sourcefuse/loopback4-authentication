import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as PassportLocal from 'passport-local';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthUser} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
import {isEmpty} from 'lodash';

export type LocalPasswordStrategyFactory = (
  options?:
    | PassportLocal.IStrategyOptions
    | PassportLocal.IStrategyOptionsWithRequest,
  verifierPassed?: VerifyFunction.LocalPasswordFn,
) => PassportLocal.Strategy;

export class LocalPasswordStrategyFactoryProvider
  implements Provider<LocalPasswordStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.LOCAL_PASSWORD_VERIFIER)
    private readonly verifierLocal: VerifyFunction.LocalPasswordFn,
  ) {}

  value(): LocalPasswordStrategyFactory {
    return (options, verifier) =>
      this.getLocalStrategyVerifier(options, verifier);
  }
  getLocalStrategyWithRequest(verifyFn: VerifyFunction.LocalPasswordFn) {
    return async (
      req: Request,
      username: string,
      password: string,
      cb: (err: Error | null, user?: IAuthUser | false) => void,
    ) => {
      try {
        const user = await verifyFn(username, password, req);
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    };
  }
  getLocalStrategyWithoutRequest(verifyFn: VerifyFunction.LocalPasswordFn) {
    return async (
      username: string,
      password: string,
      cb: (err: Error | null, user?: IAuthUser | false) => void,
    ) => {
      try {
        const user = await verifyFn(username, password);
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    };
  }
  getLocalStrategyVerifierUndefinedRequest(
    verifyFn: VerifyFunction.LocalPasswordFn,
  ) {
    return async (
      username: string,
      password: string,
      cb: (err: Error | null, user?: IAuthUser | false) => void,
    ) => {
      try {
        const user = await verifyFn(username, password, undefined);
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    };
  }
  getLocalStrategyVerifier(
    options?:
      | PassportLocal.IStrategyOptions
      | PassportLocal.IStrategyOptionsWithRequest,
    verifierPassed?: VerifyFunction.LocalPasswordFn,
  ): PassportLocal.Strategy {
    const verifyFn = verifierPassed ?? this.verifierLocal;

    if (options?.passReqToCallback) {
      return new PassportLocal.Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.getLocalStrategyWithRequest(verifyFn),
      );
    } else if (!!options && !isEmpty(options)) {
      return new PassportLocal.Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.getLocalStrategyWithoutRequest(verifyFn),
      );
    } else {
      return new PassportLocal.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.getLocalStrategyVerifierUndefinedRequest(verifyFn),
      );
    }
  }
}
