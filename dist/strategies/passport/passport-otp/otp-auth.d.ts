import * as passport from 'passport';
export declare namespace Otp {
    interface VerifyFunction {
        (key: string, otp: string, done: (error: any, user?: any, info?: any) => void): void;
    }
    interface StrategyOptions {
        key?: string;
        otp?: string;
    }
    type VerifyCallback = (err?: string | Error | null, user?: any, info?: any) => void;
    class Strategy extends passport.Strategy {
        constructor(_options?: StrategyOptions, verify?: VerifyFunction);
        name: string;
        private readonly verify;
        authenticate(req: any, options?: StrategyOptions): void;
    }
}
