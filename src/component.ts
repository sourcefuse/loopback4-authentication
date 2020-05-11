import {Component, ProviderMap} from '@loopback/core';

import {AuthenticationBindings} from './keys';
import {
  AuthenticateActionProvider,
  AuthMetadataProvider,
  ClientAuthenticateActionProvider,
  ClientAuthMetadataProvider,
} from './providers';
import {
  AuthStrategyProvider,
  ClientAuthStrategyProvider,
  ClientPasswordVerifyProvider,
  LocalPasswordVerifyProvider,
  BearerTokenVerifyProvider,
  ResourceOwnerVerifyProvider,
  LocalPasswordStrategyFactoryProvider,
  ClientPasswordStrategyFactoryProvider,
  BearerStrategyFactoryProvider,
  ResourceOwnerPasswordStrategyFactoryProvider,
} from './strategies';
import {Strategies} from './strategies/keys';
import {
  GoogleAuthStrategyFactoryProvider,
  GoogleAuthVerifyProvider,
} from './strategies/passport/passport-google-oauth2';

import {
  AzureADAuthStrategyFactoryProvider,
  AzureADAuthVerifyProvider,
} from './strategies/passport/passport-azure-ad';

export class AuthenticationComponent implements Component {
  constructor() {
    this.providers = {
      [AuthenticationBindings.USER_AUTH_ACTION.key]: AuthenticateActionProvider,
      [AuthenticationBindings.CLIENT_AUTH_ACTION
        .key]: ClientAuthenticateActionProvider,
      [AuthenticationBindings.USER_METADATA.key]: AuthMetadataProvider,
      [AuthenticationBindings.CLIENT_METADATA.key]: ClientAuthMetadataProvider,
      [AuthenticationBindings.USER_STRATEGY.key]: AuthStrategyProvider,
      [AuthenticationBindings.CLIENT_STRATEGY.key]: ClientAuthStrategyProvider,

      // Strategy function factories
      [Strategies.Passport.LOCAL_STRATEGY_FACTORY
        .key]: LocalPasswordStrategyFactoryProvider,
      [Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY
        .key]: ClientPasswordStrategyFactoryProvider,
      [Strategies.Passport.BEARER_STRATEGY_FACTORY
        .key]: BearerStrategyFactoryProvider,
      [Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY
        .key]: ResourceOwnerPasswordStrategyFactoryProvider,
      [Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY
        .key]: GoogleAuthStrategyFactoryProvider,
      [Strategies.Passport.AZURE_AD_STRATEGY_FACTORY
        .key]: AzureADAuthStrategyFactoryProvider,

      // Verifier functions
      [Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER
        .key]: ClientPasswordVerifyProvider,
      [Strategies.Passport.LOCAL_PASSWORD_VERIFIER
        .key]: LocalPasswordVerifyProvider,
      [Strategies.Passport.BEARER_TOKEN_VERIFIER
        .key]: BearerTokenVerifyProvider,
      [Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER
        .key]: ResourceOwnerVerifyProvider,
      [Strategies.Passport.GOOGLE_OAUTH2_VERIFIER
        .key]: GoogleAuthVerifyProvider,
      [Strategies.Passport.AZURE_AD_VERIFIER.key]: AzureADAuthVerifyProvider,
    };
  }

  providers?: ProviderMap;
}
