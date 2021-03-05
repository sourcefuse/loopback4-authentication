// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/core';
import {Request, Response} from '@loopback/rest';
import {VerifyFunction} from './strategies';
export * from './strategies/types';

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

export interface AuthenticationMetadata<T = void> {
  strategy: string;
  options?: Object;
  verifier?: BindingKey<VerifyFunction.GenericAuthFn<T>>;
  authOptions?: (req: Request) => Object;
}

/**
 * interface definition of a function which accepts a request
 * and returns an authenticated user
 */
export interface AuthenticateFn<T> {
  (request: Request, response?: Response): Promise<T>;
}

export interface ClientAuthCode<T extends IAuthUser, ID = number> {
  clientId: string;
  userId?: ID;
  user?: T;
}
