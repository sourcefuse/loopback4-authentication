import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import * as PassportLocal from 'passport-local';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthUser} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
import {isEmpty} from 'lodash';

export interface LocalPasswordStrategyFactory {
  (
    options?:
      | PassportLocal.IStrategyOptions
      | PassportLocal.IStrategyOptionsWithRequest,
    verifierPassed?: VerifyFunction.LocalPasswordFn,
  ): PassportLocal.Strategy;
}

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
        async (
          req: Request,
          username: string,
          password: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await verifyFn(username, password, req);
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
    } else if (!!options && !isEmpty(options)) {
      return new PassportLocal.Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          username: string,
          password: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await verifyFn(username, password);
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
      return new PassportLocal.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          username: string,
          password: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await verifyFn(username, password, undefined);
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
