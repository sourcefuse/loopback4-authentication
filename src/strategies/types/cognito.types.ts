export namespace Cognito {
  export interface StrategyOptions {
    callbackURL: string;
    clientDomain: string;
    clientID: string;
    clientSecret: string;
    region: string;
    passReqToCallback?: boolean;
  }

  export interface Profile {
    email: string;
    username: string;
    sub: string;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    phone_number?: string;
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
