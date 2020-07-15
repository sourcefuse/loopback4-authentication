import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {Strategy} from 'passport';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as AzureADAuthStrategy from 'passport-azure-ad';
import * as PassportBearer from 'passport-http-bearer';
import * as PassportLocal from 'passport-local';

import {AuthenticationBindings} from '../keys';
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
import {AzureADAuthStrategyFactory} from './passport/passport-azure-ad';
import {KeycloakStrategyFactory} from './passport';

export class AuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.USER_METADATA)
    private readonly metadata: AuthenticationMetadata,
    @inject(Strategies.Passport.LOCAL_STRATEGY_FACTORY)
    private readonly getLocalStrategyVerifier: LocalPasswordStrategyFactory,
    @inject(Strategies.Passport.BEARER_STRATEGY_FACTORY)
    private readonly getBearerStrategyVerifier: BearerStrategyFactory,
    @inject(Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY)
    private readonly getResourceOwnerVerifier: ResourceOwnerPasswordStrategyFactory,
    @inject(Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY)
    private readonly getGoogleAuthVerifier: GoogleAuthStrategyFactory,
    @inject(Strategies.Passport.AZURE_AD_STRATEGY_FACTORY)
    private readonly getAzureADAuthVerifier: AzureADAuthStrategyFactory,
    @inject(Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY)
    private readonly getKeycloakVerifier: KeycloakStrategyFactory,
  ) {}

  value(): ValueOrPromise<Strategy | undefined> {
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === STRATEGY.LOCAL) {
      return this.getLocalStrategyVerifier(
        this.metadata.options as
          | PassportLocal.IStrategyOptions
          | PassportLocal.IStrategyOptionsWithRequest,
      );
    } else if (name === STRATEGY.BEARER) {
      return this.getBearerStrategyVerifier(
        this.metadata.options as PassportBearer.IStrategyOptions,
      );
    } else if (name === STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT) {
      return this.getResourceOwnerVerifier(
        this.metadata
          .options as Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
      );
    } else if (name === STRATEGY.GOOGLE_OAUTH2) {
      return this.getGoogleAuthVerifier(
        this.metadata.options as
          | GoogleStrategy.StrategyOptions
          | GoogleStrategy.StrategyOptionsWithRequest,
      );
    } else if (name === STRATEGY.AZURE_AD) {
      return this.getAzureADAuthVerifier(
        this.metadata.options as
          | AzureADAuthStrategy.IOIDCStrategyOptionWithRequest
          | AzureADAuthStrategy.IOIDCStrategyOptionWithoutRequest,
      );
    } else if (name === STRATEGY.KEYCLOAK) {
      return this.getKeycloakVerifier(this.metadata.options);
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }
}
