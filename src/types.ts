// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Request} from '@loopback/rest';

export interface IAuthClient {
  clientId: string;
  clientSecret: string;
  redirectUrl?: string;
}

export interface IAuthUser {
  id?: number | string;
  username: string;
  password?: string;
}

export interface AuthenticationMetadata {
  strategy: string;
  options?: Object;
}

/**
 * interface definition of a function which accepts a request
 * and returns an authenticated user
 */
export interface AuthenticateFn<T> {
  (request: Request): Promise<T>;
}

export interface ClientAuthCode<T extends IAuthUser> {
  clientId: string;
  userId?: number;
  user?: T;
}

export namespace VerifyFunction {
  export interface OauthClientPasswordFn {
    (
      clientId: string,
      clientSecret: string,
      req?: Request,
    ): Promise<IAuthClient | null>;
  }

  export interface LocalPasswordFn {
    (
      username: string,
      password: string,
      req?: Request,
    ): Promise<IAuthUser | null>;
  }

  export interface BearerFn {
    (token: string, req?: Request): Promise<IAuthUser | null>;
  }

  export interface ResourceOwnerPasswordFn {
    (
      clientId: string,
      clientSecret: string,
      username: string,
      password: string,
      req?: Request,
    ): Promise<{client: IAuthClient; user: IAuthUser} | null>;
  }
}
