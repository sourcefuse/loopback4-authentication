import { Provider } from '@loopback/core';
import { Strategy, StrategyOption, StrategyOptionWithRequest } from 'passport-facebook';
import { VerifyFunction } from '../../types';
interface ExtendedStrategyOption extends StrategyOption {
    passReqToCallback?: false;
}
export interface FacebookAuthStrategyFactory {
    (options: ExtendedStrategyOption | StrategyOptionWithRequest, verifierPassed?: VerifyFunction.FacebookAuthFn): Strategy;
}
export declare class FacebookAuthStrategyFactoryProvider implements Provider<FacebookAuthStrategyFactory> {
    private readonly verifierFacebookAuth;
    constructor(verifierFacebookAuth: VerifyFunction.FacebookAuthFn);
    value(): FacebookAuthStrategyFactory;
    getFacebookAuthStrategyVerifier(options: ExtendedStrategyOption | StrategyOptionWithRequest, verifierPassed?: VerifyFunction.FacebookAuthFn): Strategy;
    private _setupProxy;
}
export {};
