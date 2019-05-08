import * as passport from 'passport';

export interface StrategyOptionsWithRequestInterface {
  passReqToCallback: boolean;
}

export interface VerifyFunctionWithRequest {
  (
    req: any,
    clientId: string,
    clientSecret: string,
    username: string,
    password: string,
    done: (error: any, client?: any, info?: any) => void,
  ): void;
}

export interface VerifyFunction {
  (
    clientId: string,
    clientSecret: string,
    username: string,
    password: string,
    done: (error: any, client?: any, info?: any) => void,
  ): void;
}

export class Strategy extends passport.Strategy {
  constructor(verify: VerifyFunction);
  constructor(
    options: StrategyOptionsWithRequestInterface,
    verify: VerifyFunctionWithRequest,
  );
  constructor(
    options: StrategyOptionsWithRequestInterface,
    verify: VerifyFunction,
  );
  constructor(
    options: StrategyOptionsWithRequestInterface | VerifyFunction,
    verify?: VerifyFunctionWithRequest | VerifyFunction,
  ) {
    super();
    if (verify) {
      this.passReqToCallback = (options as StrategyOptionsWithRequestInterface).passReqToCallback;
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

  authenticate(req: any, options?: {}): void {
    if (
      !req.body ||
      (!req.body['client_id'] || !req.body['username'] || !req.body['password'])
    ) {
      return this.fail();
    }

    const clientId = req.body['client_id'];
    const clientSecret = req.body['client_secret'];
    const username = req.body['username'];
    const password = req.body['password'];

    const verified = (err: any, client: any, user: any) => {
      if (err) {
        return this.error(err);
      }
      if (!client) {
        return this.fail();
      }
      if (!user) {
        return this.fail();
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
