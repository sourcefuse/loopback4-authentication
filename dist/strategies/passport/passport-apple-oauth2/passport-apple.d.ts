import * as express from 'express';
import * as oauth2 from 'passport-oauth2';
import * as AppleStrategy from 'passport-apple';
declare module 'passport-apple' {
    interface AppleCallbackParameters {
        access_token: string;
        refresh_token?: string;
        id_token?: string;
        expires_in: number;
        scope: string;
        token_type: string;
    }
    class Strategy extends oauth2.Strategy {
        constructor(options: AppleStrategy.AuthenticateOptions, verify: (accessToken: string, refreshToken: string, idToken: string, profile: AppleStrategy.Profile, done: AppleStrategy.VerifyCallback) => void);
        constructor(options: AppleStrategy.AuthenticateOptions, verify: (accessToken: string, refreshToken: string, idToken: string, params: AppleCallbackParameters, profile: AppleStrategy.Profile, done: AppleStrategy.VerifyCallback) => void);
        constructor(options: AppleStrategy.AuthenticateOptionsWithRequest, verify: (req: express.Request, accessToken: string, refreshToken: string, idToken: string, profile: AppleStrategy.Profile, done: AppleStrategy.VerifyCallback) => void);
        constructor(options: AppleStrategy.AuthenticateOptionsWithRequest, verify: (req: express.Request, accessToken: string, refreshToken: string, idToken: string, params: AppleCallbackParameters, profile: AppleStrategy.Profile, done: AppleStrategy.VerifyCallback) => void);
    }
}
