import {Request} from '@loopback/rest';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as AzureADStrategy from 'passport-azure-ad';

import {IAuthClient, IAuthUser} from '../types';

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

  export interface GoogleAuthFn {
    (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
      cb: GoogleStrategy.VerifyCallback,
      req?: Request,
    ): Promise<IAuthUser | null>;
  }

  export interface AzureADAuthFn {
    (
      profile: AzureADStrategy.IProfile,
      done: AzureADStrategy.VerifyCallback,
      req?: Request,
    ): Promise<IAuthUser | null>;
  }

  export interface KeycloakAuthFn {
    (
      accessToken: string,
      refreshToken: string,
      profile: KeycloakProfile,
      cb: (err?: string | Error, user?: IAuthUser) => void,
    ): Promise<IAuthUser | null>;
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
