import {Binding, Component, inject, ProviderMap} from '@loopback/core';
import {createMiddlewareBinding} from '@loopback/express';

import {AuthenticationBindings} from './keys';
import {
  ClientAuthenticationMiddlewareProvider,
  UserAuthenticationMiddlewareProvider,
} from './middlewares';
import {
  AuthenticateActionProvider,
  AuthMetadataProvider,
  ClientAuthenticateActionProvider,
  ClientAuthMetadataProvider,
} from './providers';
import {
  AzureADAuthStrategyFactoryProvider,
  AzureADAuthVerifyProvider,
} from './strategies/passport/passport-azure-ad';
import {
  BearerStrategyFactoryProvider,
  BearerTokenVerifyProvider,
} from './strategies/passport/passport-bearer';
import {
  ClientPasswordStrategyFactoryProvider,
  ClientPasswordVerifyProvider,
} from './strategies/passport/passport-client-password';
import {
  GoogleAuthStrategyFactoryProvider,
  GoogleAuthVerifyProvider,
} from './strategies/passport/passport-google-oauth2';
import {
  InstagramAuthStrategyFactoryProvider,
  InstagramAuthVerifyProvider,
} from './strategies/passport/passport-insta-oauth2';
import {
  FacebookAuthStrategyFactoryProvider,
  FacebookAuthVerifyProvider,
} from './strategies/passport/passport-facebook-oauth2';
import {
  AppleAuthStrategyFactoryProvider,
  AppleAuthVerifyProvider,
} from './strategies/passport/passport-apple-oauth2';
import {
  KeycloakStrategyFactoryProvider,
  KeycloakVerifyProvider,
} from './strategies/passport/passport-keycloak';
import {
  LocalPasswordStrategyFactoryProvider,
  LocalPasswordVerifyProvider,
} from './strategies/passport/passport-local';
import {
  ResourceOwnerVerifyProvider,
  ResourceOwnerPasswordStrategyFactoryProvider,
} from './strategies/passport/passport-resource-owner-password';
import {
  PassportOtpStrategyFactoryProvider,
  OtpVerifyProvider,
} from './strategies/passport/passport-otp';
import {AuthStrategyProvider, ClientAuthStrategyProvider} from './strategies';
import {Strategies} from './strategies/keys';
import {
  CognitoAuthVerifyProvider,
  CognitoStrategyFactoryProvider,
} from './strategies/passport/passport-cognito-oauth2';
import {
  SamlStrategyFactoryProvider,
  SamlVerifyProvider,
} from './strategies/SAML';
import {AuthenticationConfig} from './types';

export class AuthenticationComponent implements Component {
  constructor(
    @inject(AuthenticationBindings.CONFIG, {optional: true})
    private readonly config?: AuthenticationConfig,
  ) {
    this.providers = {
      [AuthenticationBindings.USER_AUTH_ACTION.key]: AuthenticateActionProvider,
      [AuthenticationBindings.CLIENT_AUTH_ACTION.key]:
        ClientAuthenticateActionProvider,
      [AuthenticationBindings.USER_METADATA.key]: AuthMetadataProvider,
      [AuthenticationBindings.CLIENT_METADATA.key]: ClientAuthMetadataProvider,
      [AuthenticationBindings.USER_STRATEGY.key]: AuthStrategyProvider,
      [AuthenticationBindings.CLIENT_STRATEGY.key]: ClientAuthStrategyProvider,

      // Strategy function factories
      [Strategies.Passport.LOCAL_STRATEGY_FACTORY.key]:
        LocalPasswordStrategyFactoryProvider,
      [Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY.key]:
        PassportOtpStrategyFactoryProvider,
      [Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY.key]:
        ClientPasswordStrategyFactoryProvider,
      [Strategies.Passport.BEARER_STRATEGY_FACTORY.key]:
        BearerStrategyFactoryProvider,
      [Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY.key]:
        ResourceOwnerPasswordStrategyFactoryProvider,
      [Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY.key]:
        GoogleAuthStrategyFactoryProvider,
      [Strategies.Passport.SAML_STRATEGY_FACTORY.key]:
        SamlStrategyFactoryProvider,
      [Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY.key]:
        InstagramAuthStrategyFactoryProvider,
      [Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY.key]:
        FacebookAuthStrategyFactoryProvider,
      [Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY.key]:
        AppleAuthStrategyFactoryProvider,
      [Strategies.Passport.AZURE_AD_STRATEGY_FACTORY.key]:
        AzureADAuthStrategyFactoryProvider,
      [Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY.key]:
        KeycloakStrategyFactoryProvider,
      [Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY.key]:
        CognitoStrategyFactoryProvider,

      // Verifier functions
      [Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER.key]:
        ClientPasswordVerifyProvider,
      [Strategies.Passport.LOCAL_PASSWORD_VERIFIER.key]:
        LocalPasswordVerifyProvider,
      [Strategies.Passport.OTP_VERIFIER.key]: OtpVerifyProvider,
      [Strategies.Passport.BEARER_TOKEN_VERIFIER.key]:
        BearerTokenVerifyProvider,
      [Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER.key]:
        ResourceOwnerVerifyProvider,
      [Strategies.Passport.GOOGLE_OAUTH2_VERIFIER.key]:
        GoogleAuthVerifyProvider,
      [Strategies.Passport.SAML_VERIFIER.key]: SamlVerifyProvider,
      [Strategies.Passport.INSTAGRAM_OAUTH2_VERIFIER.key]:
        InstagramAuthVerifyProvider,
      [Strategies.Passport.FACEBOOK_OAUTH2_VERIFIER.key]:
        FacebookAuthVerifyProvider,
      [Strategies.Passport.COGNITO_OAUTH2_VERIFIER.key]:
        CognitoAuthVerifyProvider,
      [Strategies.Passport.APPLE_OAUTH2_VERIFIER.key]: AppleAuthVerifyProvider,
      [Strategies.Passport.AZURE_AD_VERIFIER.key]: AzureADAuthVerifyProvider,
      [Strategies.Passport.KEYCLOAK_VERIFIER.key]: KeycloakVerifyProvider,
    };
    this.bindings = [];
    if (this.config?.useClientAuthenticationMiddleware) {
      this.bindings.push(
        createMiddlewareBinding(ClientAuthenticationMiddlewareProvider),
      );
    }
    if (this.config?.useUserAuthenticationMiddleware) {
      this.bindings.push(
        createMiddlewareBinding(UserAuthenticationMiddlewareProvider),
      );
    }
  }

  providers?: ProviderMap;
  bindings?: Binding[];
}
