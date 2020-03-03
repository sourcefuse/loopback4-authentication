import {Component, ProviderMap} from '@loopback/core';

import {ExtAuthenticationBindings} from './keys';
import {
  UserAuthenticateActionProvider,
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

export class ExtAuthenticationComponent implements Component {
  constructor() {
    this.providers = {
      [ExtAuthenticationBindings.USER_AUTH_ACTION
        .key]: UserAuthenticateActionProvider,
      [ExtAuthenticationBindings.CLIENT_AUTH_ACTION
        .key]: ClientAuthenticateActionProvider,
      [ExtAuthenticationBindings.USER_METADATA.key]: AuthMetadataProvider,
      [ExtAuthenticationBindings.CLIENT_METADATA
        .key]: ClientAuthMetadataProvider,
      [ExtAuthenticationBindings.USER_STRATEGY.key]: AuthStrategyProvider,
      [ExtAuthenticationBindings.CLIENT_STRATEGY
        .key]: ClientAuthStrategyProvider,

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
    };
  }

  providers?: ProviderMap;
}
