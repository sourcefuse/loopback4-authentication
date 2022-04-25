import { Provider } from '@loopback/core';
import { Strategy, StrategyOption, StrategyOptionWithRequest } from 'passport-instagram';
import { VerifyFunction } from '../../types';
export interface InstagramAuthStrategyFactory {
    (options: StrategyOption | StrategyOptionWithRequest, verifierPassed?: VerifyFunction.InstagramAuthFn): Strategy;
}
export declare class InstagramAuthStrategyFactoryProvider implements Provider<InstagramAuthStrategyFactory> {
    private readonly verifierInstagramAuth;
    constructor(verifierInstagramAuth: VerifyFunction.InstagramAuthFn);
    value(): InstagramAuthStrategyFactory;
    getInstagramAuthStrategyVerifier(options: StrategyOption | StrategyOptionWithRequest, verifierPassed?: VerifyFunction.InstagramAuthFn): Strategy;
    private _setupProxy;
}
