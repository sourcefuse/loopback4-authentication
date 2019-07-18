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
  ): PassportLocal.Strategy;
}

export class LocalPasswordStrategyFactoryProvider
  implements Provider<LocalPasswordStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.LOCAL_PASSWORD_VERIFIER)
    private readonly verifierLocal: VerifyFunction.LocalPasswordFn,
  ) {}

  value(): LocalPasswordStrategyFactory {
    return options => this.getLocalStrategyVerifier(options);
  }

  getLocalStrategyVerifier(
    options?:
      | PassportLocal.IStrategyOptions
      | PassportLocal.IStrategyOptionsWithRequest,
  ): PassportLocal.Strategy {
    if (options && options.passReqToCallback) {
      return new PassportLocal.Strategy(
        options,
        async (
          req: Request,
          username: string,
          password: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await this.verifierLocal(username, password, req);
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
        async (
          username: string,
          password: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await this.verifierLocal(username, password);
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
        async (
          username: string,
          password: string,
          cb: (err: Error | null, user?: IAuthUser | false) => void,
        ) => {
          try {
            const user = await this.verifierLocal(
              username,
              password,
              undefined,
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
