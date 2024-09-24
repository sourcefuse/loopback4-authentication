import {AnyObject} from '@loopback/repository';
import {Request} from '@loopback/express';
import * as SamlStrategy from '@node-saml/passport-saml';
import * as AppleStrategy from 'passport-apple';
import {DecodedIdToken} from 'passport-apple';
import * as AzureADStrategy from 'passport-azure-ad';
import * as FacebookStrategy from 'passport-facebook';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as InstagramStrategy from 'passport-instagram';
import * as Auth0Strategy from 'passport-auth0';
import {Cognito, IAuthClient, IAuthSecureClient, IAuthUser} from '../../types';
import {Keycloak} from './keycloak.types';
import {Otp} from '../passport/passport-otp';

export type VerifyCallback = (
  err?: string | Error | null,
  user?: Express.User,

  info?: AnyObject,
) => void;

export namespace VerifyFunction {
  export interface OauthClientPasswordFn<T = IAuthClient>
    extends GenericAuthFn<T> {
    (clientId: string, clientSecret: string, req?: Request): Promise<T | null>;
  }

  export interface OauthSecureClientPasswordFn<T = IAuthSecureClient>
    extends GenericAuthFn<T> {
    (clientId: string, clientSecret: string, req?: Request): Promise<T | null>;
  }

  export interface LocalPasswordFn<T = IAuthUser> extends GenericAuthFn<T> {
    (username: string, password: string, req?: Request): Promise<T | null>;
  }

  export interface OtpAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
    (key: string, otp: string, cb: Otp.VerifyCallback): Promise<T | null>;
  }

  export interface BearerFn<T = IAuthUser> extends GenericAuthFn<T> {
    (token: string, req?: Request): Promise<T | null>;
  }

  export type ResourceOwnerPasswordFn<T = IAuthClient, S = IAuthUser> = (
    clientId: string,
    clientSecret: string,
    username: string,
    password: string,
    req?: Request,
  ) => Promise<{client: T; user: S} | null>;

  export type SecureResourceOwnerPasswordFn<
    T = IAuthSecureClient,
    S = IAuthUser,
  > = (
    clientId: string,
    clientSecret: string,
    username: string,
    password: string,
    req?: Request,
  ) => Promise<{client: T; user: S} | null>;

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
      accessToken: string,
      refreshToken: string,
      profile: AzureADStrategy.IProfile,
      done: AzureADStrategy.VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }

  export interface KeycloakAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      profile: Keycloak.Profile,
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

  export interface CognitoAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      profile: Cognito.Profile,
      cb: Cognito.VerifyCallback,
      req?: Request,
    ): Promise<T | null>;
  }
  export interface Auth0Fn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      accessToken: string,
      refreshToken: string,
      profile: Auth0Strategy.Profile,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      cb: (error: any, user?: T, info?: any) => void,
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
  export interface SamlFn<T = IAuthUser> extends GenericAuthFn<T> {
    (
      profile: SamlStrategy.Profile,
      cb: SamlStrategy.VerifiedCallback,
      req?: Request,
    ): Promise<T | null>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type GenericAuthFn<T = any> = (...params: any) => Promise<T | null>; // NOSONAR
}
