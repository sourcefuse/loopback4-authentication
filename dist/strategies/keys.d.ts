import { BindingKey } from '@loopback/core';
import { LocalPasswordStrategyFactory } from './passport/passport-local';
import { BearerStrategyFactory } from './passport/passport-bearer';
import { ResourceOwnerPasswordStrategyFactory } from './passport/passport-resource-owner-password';
import { ClientPasswordStrategyFactory } from './passport/passport-client-password/client-password-strategy-factory-provider';
import { GoogleAuthStrategyFactoryProvider } from './passport/passport-google-oauth2';
import { KeycloakStrategyFactoryProvider } from './passport/passport-keycloak';
import { AzureADAuthStrategyFactoryProvider } from './passport/passport-azure-ad';
import { VerifyFunction } from './types';
import { InstagramAuthStrategyFactoryProvider } from './passport';
import { AppleAuthStrategyFactoryProvider } from './passport/passport-apple-oauth2';
import { FacebookAuthStrategyFactoryProvider } from './passport/passport-facebook-oauth2';
export declare namespace Strategies {
    namespace Passport {
        const LOCAL_STRATEGY_FACTORY: BindingKey<LocalPasswordStrategyFactory>;
        const LOCAL_PASSWORD_VERIFIER: BindingKey<VerifyFunction.LocalPasswordFn<import("..").IAuthUser>>;
        const OTP_AUTH_STRATEGY_FACTORY: BindingKey<LocalPasswordStrategyFactory>;
        const OTP_VERIFIER: BindingKey<VerifyFunction.LocalPasswordFn<import("..").IAuthUser>>;
        const CLIENT_PASSWORD_STRATEGY_FACTORY: BindingKey<ClientPasswordStrategyFactory>;
        const OAUTH2_CLIENT_PASSWORD_VERIFIER: BindingKey<VerifyFunction.OauthClientPasswordFn<import("..").IAuthClient>>;
        const BEARER_STRATEGY_FACTORY: BindingKey<BearerStrategyFactory>;
        const BEARER_TOKEN_VERIFIER: BindingKey<VerifyFunction.BearerFn<import("..").IAuthUser>>;
        const RESOURCE_OWNER_STRATEGY_FACTORY: BindingKey<ResourceOwnerPasswordStrategyFactory>;
        const RESOURCE_OWNER_PASSWORD_VERIFIER: BindingKey<VerifyFunction.ResourceOwnerPasswordFn<import("..").IAuthClient, import("..").IAuthUser>>;
        const GOOGLE_OAUTH2_STRATEGY_FACTORY: BindingKey<GoogleAuthStrategyFactoryProvider>;
        const GOOGLE_OAUTH2_VERIFIER: BindingKey<VerifyFunction.GoogleAuthFn<import("..").IAuthUser>>;
        const AZURE_AD_STRATEGY_FACTORY: BindingKey<AzureADAuthStrategyFactoryProvider>;
        const AZURE_AD_VERIFIER: BindingKey<VerifyFunction.AzureADAuthFn<import("..").IAuthUser>>;
        const KEYCLOAK_STRATEGY_FACTORY: BindingKey<KeycloakStrategyFactoryProvider>;
        const KEYCLOAK_VERIFIER: BindingKey<VerifyFunction.KeycloakAuthFn<import("..").IAuthUser>>;
        const INSTAGRAM_OAUTH2_STRATEGY_FACTORY: BindingKey<InstagramAuthStrategyFactoryProvider>;
        const INSTAGRAM_OAUTH2_VERIFIER: BindingKey<VerifyFunction.InstagramAuthFn<import("..").IAuthUser>>;
        const FACEBOOK_OAUTH2_STRATEGY_FACTORY: BindingKey<FacebookAuthStrategyFactoryProvider>;
        const FACEBOOK_OAUTH2_VERIFIER: BindingKey<VerifyFunction.FacebookAuthFn<import("..").IAuthUser>>;
        const APPLE_OAUTH2_STRATEGY_FACTORY: BindingKey<AppleAuthStrategyFactoryProvider>;
        const APPLE_OAUTH2_VERIFIER: BindingKey<VerifyFunction.AppleAuthFn<import("..").IAuthUser>>;
    }
}
