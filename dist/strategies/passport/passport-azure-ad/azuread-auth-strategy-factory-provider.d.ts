import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../types';
import { OIDCStrategy, IOIDCStrategyOptionWithRequest, IOIDCStrategyOptionWithoutRequest } from 'passport-azure-ad';
export interface AzureADAuthStrategyFactory {
    (options: IOIDCStrategyOptionWithoutRequest | IOIDCStrategyOptionWithRequest, verifierPassed?: VerifyFunction.AzureADAuthFn): OIDCStrategy;
}
export declare class AzureADAuthStrategyFactoryProvider implements Provider<AzureADAuthStrategyFactory> {
    private readonly verifierAzureADAuth;
    constructor(verifierAzureADAuth: VerifyFunction.AzureADAuthFn);
    value(): AzureADAuthStrategyFactory;
    getAzureADAuthStrategyVerifier(options: IOIDCStrategyOptionWithoutRequest | IOIDCStrategyOptionWithRequest, verifierPassed?: VerifyFunction.AzureADAuthFn): OIDCStrategy;
}
