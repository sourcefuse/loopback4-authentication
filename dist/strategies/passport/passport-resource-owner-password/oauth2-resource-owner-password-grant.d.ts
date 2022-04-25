import * as passport from 'passport';
export declare namespace Oauth2ResourceOwnerPassword {
    interface StrategyOptionsWithRequestInterface {
        passReqToCallback: boolean;
    }
    interface VerifyFunctionWithRequest {
        (req: any, clientId: string, clientSecret: string, username: string, password: string, done: (error: any, client?: any, info?: any) => void): void;
    }
    interface VerifyFunction {
        (clientId: string, clientSecret: string, username: string, password: string, done: (error: any, client?: any, info?: any) => void): void;
    }
    class Strategy extends passport.Strategy {
        constructor(verify: VerifyFunction);
        constructor(options: StrategyOptionsWithRequestInterface | VerifyFunction, verify?: VerifyFunctionWithRequest | VerifyFunction);
        name: string;
        private readonly verify;
        private readonly passReqToCallback;
        authenticate(req: any, options?: {}): void;
    }
}
