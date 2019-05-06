// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Request} from '@loopback/rest';

/**
 * interface definition of a function which accepts a request
 * and returns an authenticated user
 */
export interface AuthenticateFn<T> {
  (request: Request): Promise<T>;
}

/**
 * interface definition of a function which accepts a request
 * and returns an authenticated client
 */
export interface AuthenticateClientFn<T> {
  (request: Request): Promise<T>;
}

export interface ClientAuthCode<T> {
  clientId: string;
  userId?: number;
  user?: T;
}
