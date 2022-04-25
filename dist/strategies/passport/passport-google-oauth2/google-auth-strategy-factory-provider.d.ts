import { Provider } from '@loopback/core';
import { Strategy, StrategyOptions, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { VerifyFunction } from '../../types';
export interface GoogleAuthStrategyFactory {
    (options: StrategyOptions | StrategyOptionsWithRequest, verifierPassed?: VerifyFunction.GoogleAuthFn): Strategy;
}
export declare class GoogleAuthStrategyFactoryProvider implements Provider<GoogleAuthStrategyFactory> {
    private readonly verifierGoogleAuth;
    constructor(verifierGoogleAuth: VerifyFunction.GoogleAuthFn);
    value(): GoogleAuthStrategyFactory;
    getGoogleAuthStrategyVerifier(options: StrategyOptions | StrategyOptionsWithRequest, verifierPassed?: VerifyFunction.GoogleAuthFn): Strategy;
    private _setupProxy;
}
