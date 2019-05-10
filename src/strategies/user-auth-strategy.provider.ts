import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {Strategy} from 'passport';
import * as PassportBearer from 'passport-http-bearer';
import * as PassportLocal from 'passport-local';

import {AuthErrorKeys} from '../error-keys';
import {AuthenticationBindings} from '../keys';
import {STRATEGY} from '../strategy-name.enum';
import {
  AuthenticationMetadata,
  IAuthUser,
  VerifyFunction,
  IAuthClient,
} from '../types';
import * as Oauth2ResourceOwnerPassword from './oauth2-resource-owner-password-grant';

export class AuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.USER_METADATA)
    private readonly metadata: AuthenticationMetadata,
    @inject(AuthenticationBindings.Passport.LOCAL_PASSWORD_VERIFIER)
    private readonly verifierLocal: VerifyFunction.LocalPasswordFn,
    @inject(AuthenticationBindings.Passport.BEARER_TOKEN_VERIFIER)
    private readonly verifierBearer: VerifyFunction.BearerFn,
    @inject(AuthenticationBindings.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
    private readonly verifierResourceOwner: VerifyFunction.ResourceOwnerPasswordFn,
  ) {}

  value(): ValueOrPromise<Strategy | undefined> {
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === STRATEGY.LOCAL) {
      return this.getLocalStrategyVerifier(this.metadata.options as
        | PassportLocal.IStrategyOptions
        | PassportLocal.IStrategyOptionsWithRequest);
    } else if (name === STRATEGY.BEARER) {
      return this.getBearerStrategyVerifier(this.metadata
        .options as PassportBearer.IStrategyOptions);
    } else if (name === STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT) {
      return this.getResourceOwnerVerifier(this.metadata
        .options as Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface);
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
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
    } else if (!!options) {
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

  getBearerStrategyVerifier(
    options?: PassportBearer.IStrategyOptions,
  ): PassportBearer.Strategy {
    if (options && options.passReqToCallback) {
      return new PassportBearer.Strategy(
        options,
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
    } else if (!!options) {
      return new PassportBearer.Strategy(
        options,
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

  getResourceOwnerVerifier(
    options?: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
  ): Oauth2ResourceOwnerPassword.Strategy {
    if (options && options.passReqToCallback) {
      return new Oauth2ResourceOwnerPassword.Strategy(
        options,
        async (
          req: Request,
          clientId: string,
          clientSecret: string,
          username: string,
          password: string,
          cb: (
            err: Error | null,
            client?: IAuthClient | false,
            user?: IAuthUser | false,
          ) => void,
        ) => {
          try {
            const userInfo = await this.verifierResourceOwner(
              clientId,
              clientSecret,
              username,
              password,
              req,
            );
            if (!userInfo) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, userInfo.client, userInfo.user);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else {
      return new Oauth2ResourceOwnerPassword.Strategy(
        async (
          clientId: string,
          clientSecret: string,
          username: string,
          password: string,
          cb: (
            err: Error | null,
            client?: IAuthClient | false,
            user?: IAuthUser | false,
          ) => void,
        ) => {
          try {
            const userInfo = await this.verifierResourceOwner(
              clientId,
              clientSecret,
              username,
              password,
            );
            if (!userInfo) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, userInfo.client, userInfo.user);
          } catch (err) {
            cb(err);
          }
        },
      );
    }
  }
}
