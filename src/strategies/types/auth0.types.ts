import {AnyObject} from '@loopback/repository';
import {StrategyOption} from 'passport-auth0';

export namespace Auth0 {
  export type VerifyCallback = (
    err?: AnyObject,
    user?: AnyObject,
    info?: AnyObject,
  ) => void;

  export interface Auth0StrategyOptions extends StrategyOption {
    passReqToCallback?: false;
  }
}
