import {Binding, Component, inject, ProviderMap} from '@loopback/core';
import {createMiddlewareBinding} from '@loopback/express';

import {AuthenticationBindings, Strategies} from './keys';
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
import {AuthStrategyProvider, ClientAuthStrategyProvider} from './strategies';
import {SecureClientPasswordStrategyFactoryProvider} from './strategies/passport/passport-client-password/secure-client-password-strategy-factory-provider';
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
    };

    if (this.config?.secureClient) {
      this.providers = {
        ...this.providers,
        [Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY.key]:
          SecureClientPasswordStrategyFactoryProvider,
      };
    }
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
