import {AnyObject} from '@loopback/repository';
import {IAuthUser} from '../../types';

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
    [key: string]: any; // NOSONAR
  }

  export type VerifyCallback = (
    err?: string | Error,

    user?: IAuthUser,

    info?: AnyObject,
  ) => void;
}
