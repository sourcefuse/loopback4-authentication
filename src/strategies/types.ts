import { Request } from '@loopback/rest';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as AzureADStrategy from 'passport-azure-ad';

import { IAuthClient, IAuthUser } from '../types';

export namespace VerifyFunction {
  export interface OauthClientPasswordFn<T = IAuthClient> {
    (
      clientId: string,
      clientSecret: string,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface LocalPasswordFn<T = IAuthUser> {
    (
      username: string,
      password: string,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface BearerFn<T = IAuthUser> {
    (token: string, req?: Request): Promise<T | null>;
  }

  export interface ResourceOwnerPasswordFn<T = IAuthClient, S = IAuthUser> {
    (
      clientId: string,
      clientSecret: string,
      username: string,
      password: string,
      req?: Request,
    ): Promise<{ client: T; user: S } | null>;
  }

  export interface GoogleAuthFn<T = IAuthUser> {
    (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
      cb: GoogleStrategy.VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface AzureADAuthFn<T = IAuthUser> {
    (
      profile: AzureADStrategy.IProfile,
      done: AzureADStrategy.VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface KeycloakAuthFn<T = IAuthUser> {
    (
      accessToken: string,
      refreshToken: string,
      profile: KeycloakProfile,
      cb: (err?: string | Error, user?: IAuthUser) => void,
    ): Promise<T | null>;
  }

  export interface GenericAuthFn<T = any> {
    (
      ...params: any
    ): Promise<T>;
  }
}

export interface KeycloakProfile {
  keycloakId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  realm: string;
}
