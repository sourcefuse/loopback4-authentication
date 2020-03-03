import {
  AuthenticationBindings,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {
  BindingScope,
  Getter,
  inject,
  Provider,
  ValueOrPromise,
} from '@loopback/context';
import {extensionPoint, extensions} from '@loopback/core';
import {Strategy} from 'passport';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as PassportBearer from 'passport-http-bearer';
import * as PassportLocal from 'passport-local';

import {ExtAuthenticationBindings} from '../keys';
import {ExtStrategyAdapter} from '../strategy-adapter';
import {STRATEGY} from '../strategy-name.enum';
import {AuthenticationMetadata} from '../types';
import {Strategies} from './keys';
import {BearerStrategyFactory} from './passport/passport-bearer';
import {GoogleAuthStrategyFactory} from './passport/passport-google-oauth2';
import {LocalPasswordStrategyFactory} from './passport/passport-local';
import {
  Oauth2ResourceOwnerPassword,
  ResourceOwnerPasswordStrategyFactory,
} from './passport/passport-resource-owner-password';

@extensionPoint(
  AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
  {scope: BindingScope.TRANSIENT},
)
export class AuthStrategyProvider
  implements Provider<AuthenticationStrategy | undefined> {
  constructor(
    @extensions()
    private readonly authenticationStrategies: Getter<AuthenticationStrategy[]>,
    @inject(ExtAuthenticationBindings.USER_METADATA)
    private readonly metadata: AuthenticationMetadata,
    @inject(Strategies.Passport.LOCAL_STRATEGY_FACTORY)
    private readonly getLocalStrategyVerifier: LocalPasswordStrategyFactory,
    @inject(Strategies.Passport.BEARER_STRATEGY_FACTORY)
    private readonly getBearerStrategyVerifier: BearerStrategyFactory,
    @inject(Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY)
    private readonly getResourceOwnerVerifier: ResourceOwnerPasswordStrategyFactory,
    @inject(Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY)
    private readonly getGoogleAuthVerifier: GoogleAuthStrategyFactory,
  ) {}

  value(): ValueOrPromise<AuthenticationStrategy | undefined> {
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === STRATEGY.LOCAL) {
      return this.convertToAuthStrategy(
        this.getLocalStrategyVerifier(this.metadata.options as
          | PassportLocal.IStrategyOptions
          | PassportLocal.IStrategyOptionsWithRequest),
        name,
      );
    } else if (name === STRATEGY.BEARER) {
      return this.convertToAuthStrategy(
        this.getBearerStrategyVerifier(this.metadata
          .options as PassportBearer.IStrategyOptions),
        name,
      );
    } else if (name === STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT) {
      return this.convertToAuthStrategy(
        this.getResourceOwnerVerifier(this.metadata
          .options as Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface),
        name,
      );
    } else if (name === STRATEGY.GOOGLE_OAUTH2) {
      return this.convertToAuthStrategy(
        this.getGoogleAuthVerifier(this.metadata.options as
          | GoogleStrategy.StrategyOptions
          | GoogleStrategy.StrategyOptionsWithRequest),
        name,
      );
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  convertToAuthStrategy(
    strategy: Strategy,
    name: string,
  ): AuthenticationStrategy {
    return new ExtStrategyAdapter(strategy, name);
  }

  async findAuthenticationStrategy(name: string) {
    const strategies = await this.authenticationStrategies();
    return strategies.find(a => a.name === name);
  }
}
