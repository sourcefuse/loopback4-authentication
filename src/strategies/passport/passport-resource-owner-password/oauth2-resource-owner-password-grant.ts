import * as passport from 'passport';
import {Request} from '@loopback/rest';
import {IAuthClient, IAuthUser} from '../../../types';

export namespace Oauth2ResourceOwnerPassword {
  export interface StrategyOptionsWithRequestInterface {
    passReqToCallback: boolean;
  }

  export interface VerifyFunctionWithRequest {
    (
      req: Request,
      clientId: string,
      clientSecret: string,
      username: string,
      password: string,
      done: (
        error: Error | null,
        client?: IAuthClient | false,
        info?: IAuthUser | false,
      ) => void,
    ): void;
  }

  export interface VerifyFunction {
    (
      clientId: string,
      clientSecret: string,
      username: string,
      password: string,
      done: (
        error: Error | null,
        client?: IAuthClient | false,
        info?: IAuthUser | false,
      ) => void,
    ): void;
  }

  export class Strategy extends passport.Strategy {
    constructor(verify: VerifyFunction);
    constructor(
      options: StrategyOptionsWithRequestInterface | VerifyFunction,
      verify?: VerifyFunctionWithRequest | VerifyFunction,
    );
    constructor(
      options: StrategyOptionsWithRequestInterface | VerifyFunction,
      verify?: VerifyFunctionWithRequest | VerifyFunction,
    ) {
      super();
      if (verify) {
        this.passReqToCallback = (
          options as StrategyOptionsWithRequestInterface
        ).passReqToCallback;
        this.verify = verify;
      } else {
        this.passReqToCallback = false;
        this.verify = options as VerifyFunction;
      }
      this.name = 'oauth2-resource-owner-password';
    }

    name: string;
    private readonly verify: VerifyFunction | VerifyFunctionWithRequest;
    private readonly passReqToCallback: boolean;

    authenticate(req: Request, options?: {}): void {
      if (
        /* eslint-disable @typescript-eslint/prefer-optional-chain */
        !req.body ||
        !req.body?.['client_id'] ||
        !req.body?.['username'] ||
        !req.body?.['password']
      ) {
        this.fail();
        return;
      }

      const clientId = req.body['client_id'];
      const clientSecret = req.body['client_secret'];
      const username = req.body['username'];
      const password = req.body['password'];

      const verified = (
        err: Error | null,
        client?: IAuthClient | false,
        user?: IAuthUser | false,
      ) => {
        if (err) {
          this.error(err);
          return;
        }
        if (!client) {
          this.fail();
          return;
        }
        if (!user) {
          this.fail();
          return;
        }
        this.success(user);
      };

      if (this.passReqToCallback) {
        (this.verify as VerifyFunctionWithRequest)(
          req,
          clientId,
          clientSecret,
          username,
          password,
          verified,
        );
      } else {
        (this.verify as VerifyFunction)(
          clientId,
          clientSecret,
          username,
          password,
          verified,
        );
      }
    }
  }
}
