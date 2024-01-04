import {AnyObject} from '@loopback/repository';
import {Request} from '@loopback/rest';
import * as passport from 'passport';

export namespace Otp {
  export type VerifyFunction = (
    key: string,
    otp: string,
    done: (
      error?: string | Error | null,
      user?: AnyObject,
      info?: AnyObject,
    ) => void,
  ) => void;

  export interface StrategyOptions {
    key?: string;
    otp?: string;
  }

  export type VerifyCallback = (
    err?: string | Error | null,
    user?: AnyObject,
    info?: AnyObject,
  ) => void;

  export class Strategy extends passport.Strategy {
    constructor(_options?: StrategyOptions, verify?: VerifyFunction) {
      super();
      this.name = 'otp';
      if (verify) {
        this.verify = verify;
      }
    }

    name: string;
    private readonly verify: VerifyFunction;

    authenticate(req: Request, options?: StrategyOptions): void {
      const key = req.body.key || options?.key;
      const otp = req.body.otp || options?.otp;

      if (!key) {
        this.fail();
        return;
      }

      const verified = (
        err?: string | Error | null,
        user?: AnyObject,
        _info?: AnyObject,
      ) => {
        if (err) {
          this.error(err);
          return;
        }
        if (!user) {
          this.fail();
          return;
        }
        this.success(user);
      };

      this.verify(key, otp, verified);
    }
  }
}
