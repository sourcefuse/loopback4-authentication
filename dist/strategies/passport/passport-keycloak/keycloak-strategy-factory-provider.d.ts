import { Provider } from '@loopback/core';
import { Keycloak, VerifyFunction } from '../../types';
export declare const KeycloakStrategy: any;
export interface KeycloakStrategyFactory {
    (options: Keycloak.StrategyOptions, verifierPassed?: VerifyFunction.KeycloakAuthFn): typeof KeycloakStrategy;
}
export declare class KeycloakStrategyFactoryProvider implements Provider<KeycloakStrategyFactory> {
    private readonly verifierKeycloak;
    constructor(verifierKeycloak: VerifyFunction.KeycloakAuthFn);
    value(): KeycloakStrategyFactory;
    getKeycloakAuthStrategyVerifier(options: Keycloak.StrategyOptions, verifierPassed?: VerifyFunction.KeycloakAuthFn): typeof KeycloakStrategy;
    private _userProfileFn;
    private _setupProxy;
}
