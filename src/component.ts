import {Component, ProviderMap} from '@loopback/core';

import {AuthenticationBindings} from './keys';
import {
  AuthenticateActionProvider,
  AuthMetadataProvider,
  ClientAuthenticateActionProvider,
  ClientAuthMetadataProvider,
  ClientPasswordVerifyProvider,
  LocalPasswordVerifyProvider,
  BearerTokenVerifyProvider,
  ResourceOwnerVerifyProvider,
} from './providers';
import {AuthStrategyProvider, ClientAuthStrategyProvider} from './strategies';

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
      [AuthenticationBindings.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER
        .key]: ClientPasswordVerifyProvider,
      [AuthenticationBindings.Passport.LOCAL_PASSWORD_VERIFIER
        .key]: LocalPasswordVerifyProvider,
      [AuthenticationBindings.Passport.BEARER_TOKEN_VERIFIER
        .key]: BearerTokenVerifyProvider,
      [AuthenticationBindings.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER
        .key]: ResourceOwnerVerifyProvider,
    };
  }

  providers?: ProviderMap;
}
