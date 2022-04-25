import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../types';
import { Oauth2ResourceOwnerPassword } from './oauth2-resource-owner-password-grant';
export interface ResourceOwnerPasswordStrategyFactory {
    (options?: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface, verifierPassed?: VerifyFunction.ResourceOwnerPasswordFn): Oauth2ResourceOwnerPassword.Strategy;
}
export declare class ResourceOwnerPasswordStrategyFactoryProvider implements Provider<ResourceOwnerPasswordStrategyFactory> {
    private readonly verifierResourceOwner;
    constructor(verifierResourceOwner: VerifyFunction.ResourceOwnerPasswordFn);
    value(): ResourceOwnerPasswordStrategyFactory;
    getResourceOwnerVerifier(options?: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface, verifierPassed?: VerifyFunction.ResourceOwnerPasswordFn): Oauth2ResourceOwnerPassword.Strategy;
}
