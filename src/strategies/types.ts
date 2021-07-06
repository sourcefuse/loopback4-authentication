import {Request} from '@loopback/rest';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as AzureADStrategy from 'passport-azure-ad';
import * as InstagramStrategy from 'passport-instagram';
import * as FacebookStrategy from 'passport-facebook';
import * as AppleStrategy from 'passport-apple';
import {DecodedIdToken} from 'passport-apple';
import {IAuthClient, IAuthUser} from '../types';

export type VerifyCallback = (
  err?: string | Error | null,
  user?: Express.User,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: any,
) => void;

export namespace VerifyFunction {
  export interface OauthClientPasswordFn<T = IAuthClient>
    extends GenericAuthFn<T> {
    (clientId: string, clientSecret: string, req?: Request): Promise<T | null>;
  }

  export interface LocalPasswordFn<T = IAuthUser> extends GenericAuthFn<T> {
    (username: string, password: string, req?: Request): Promise<T | null>;
  }

  export interface BearerFn<T = IAuthUser> extends GenericAuthFn<T> {
    (token: string, req?: Request): Promise<T | null>;
  }

  export interface ResourceOwnerPasswordFn<T = IAuthClient, S = IAuthUser> {
    (
      clientId: string,
      clientSecret: string,
      username: string,
      password: string,
      req?: Request,
    ): Promise<{client: T; user: S} | null>;
  }

  export interface GoogleAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
      cb: GoogleStrategy.VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface AzureADAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      profile: AzureADStrategy.IProfile,
      done: AzureADStrategy.VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface KeycloakAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      profile: KeycloakProfile,
      cb: (err?: string | Error, user?: IAuthUser) => void,
    ): Promise<T | null>;
  }

  export interface InstagramAuthFn<T = IAuthUser>
    extends VerifyFunction.GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      profile: InstagramStrategy.Profile,
      cb: VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface FacebookAuthFn<T = IAuthUser>
    extends VerifyFunction.GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      profile: FacebookStrategy.Profile,
      cb: VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface AppleAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      decodedIdToken: DecodedIdToken,
      profile: AppleStrategy.Profile,
      cb: AppleStrategy.VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface GenericAuthFn<T = any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...params: any): Promise<T | null>;
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
