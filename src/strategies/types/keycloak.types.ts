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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  export type VerifyCallback = (
    err?: string | Error,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info?: any,
  ) => void;
}
