/* eslint-disable @typescript-eslint/no-explicit-any */
import * as oauth2 from 'passport-oauth2';

export namespace Keycloak {
  export interface StrategyOptions {
    host: string;
    realm: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    authorizationURL: string;
    tokenURL: string;
    userInfoURL: string;
  }

  export interface Profile {
    keycloakId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    avatar: string;
    realm: string;
  }

  export type VerifyCallback = (
    err?: string | Error,
    user?: any,
    info?: any,
  ) => void;

  export class Strategy extends oauth2.Strategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToke: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
      ) => void,
    ) {
      super(options, verify);
    }
  }
}
