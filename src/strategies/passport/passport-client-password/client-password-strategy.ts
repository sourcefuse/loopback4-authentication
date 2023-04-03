// Type definitions for passport-oauth2-client-password 0.1.2
// Project: https://github.com/jaredhanson/passport-oauth2-client-password
// Definitions by: Ivan Zubok <https://github.com/akaNightmare>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

import * as passport from 'passport';
import * as express from 'express';
import {IAuthClient, IAuthSecureClient} from '../../../types';

export interface StrategyOptionsWithRequestInterface {
  passReqToCallback: boolean;
}

export interface VerifyFunctionWithRequest {
  (
    clientId: string,
    clientSecret: string | undefined,
    done: (
      error: Error | null,
      client?: IAuthSecureClient | IAuthClient | null,
      info?: Object | undefined,
    ) => void,
    req?: express.Request,
  ): void;
}

export class Strategy extends passport.Strategy {
  constructor(
    verify: VerifyFunctionWithRequest,
    options?: StrategyOptionsWithRequestInterface,
  ) {
    super();
    if (!verify)
      throw new Error(
        'OAuth 2.0 client password strategy requires a verify function',
      );

    this.verify = verify;
    if (options) this.passReqToCallback = options.passReqToCallback;
    this.name = 'oauth2-client-password';
  }

  private readonly verify: VerifyFunctionWithRequest;
  private readonly passReqToCallback: boolean;
  name: string;
  authenticate(req: express.Request, options?: {}): void {
    if (!req?.body?.client_id) {
      return this.fail();
    }

    const clientId = req.body['client_id'];
    const clientSecret = req.body['client_secret'];

    const verified = (
      err: Error | null,
      client: IAuthSecureClient | IAuthClient | null | undefined,
      info: Object | undefined,
    ) => {
      if (err) {
        return this.error(err);
      }
      if (!client) {
        return this.fail();
      }
      this.success(client, info);
    };

    if (this.passReqToCallback) {
      this.verify(clientId, clientSecret, verified, req);
    } else {
      this.verify(clientId, clientSecret, verified);
    }
  }
}
