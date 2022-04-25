import { Provider } from '@loopback/core';
import { AuthenticateOptions, AuthenticateOptionsWithRequest } from 'passport-apple';
import { VerifyFunction } from '../../types';
import Strategy from 'passport-apple';
export interface AppleAuthStrategyFactory {
    (options: AuthenticateOptions | AuthenticateOptionsWithRequest, verifierPassed?: VerifyFunction.AppleAuthFn): Strategy;
}
export declare class AppleAuthStrategyFactoryProvider implements Provider<AppleAuthStrategyFactory> {
    private readonly verifierAppleAuth;
    constructor(verifierAppleAuth: VerifyFunction.AppleAuthFn);
    value(): AppleAuthStrategyFactory;
    getAppleAuthStrategyVerifier(options: AuthenticateOptions | AuthenticateOptionsWithRequest, verifierPassed?: VerifyFunction.AppleAuthFn): Strategy;
    private _setupProxy;
}
