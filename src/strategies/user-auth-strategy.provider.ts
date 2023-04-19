import {Context, inject, Provider} from '@loopback/core';
import {Strategy} from 'passport';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as AzureADAuthStrategy from 'passport-azure-ad';
import * as PassportBearer from 'passport-http-bearer';
import * as PassportLocal from 'passport-local';
import * as InstagramStrategy from 'passport-instagram';
import * as FacebookStrategy from 'passport-facebook';
import * as AppleStrategy from 'passport-apple';
import {SamlConfig} from '@node-saml/passport-saml';
import {AuthenticationBindings} from '../keys';
import {STRATEGY} from '../strategy-name.enum';
import {AuthenticationMetadata} from '../types';
import {Strategies} from './keys';
import {Oauth2ResourceOwnerPassword} from './passport/passport-resource-owner-password';
import {Otp} from './passport';
import {Cognito, Keycloak, VerifyFunction} from './types';

interface ExtendedStrategyOption extends FacebookStrategy.StrategyOption {
  passReqToCallback?: false;
}

export class AuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.USER_METADATA)
    private readonly metadata: AuthenticationMetadata,
    @inject.context() private readonly ctx: Context,
  ) {}

  async value(): Promise<Strategy | undefined> {
    if (!this.metadata) {
      return undefined;
    }

    //check if custom verifier binding is provided in the metadata
    let verifier;
    if (this.metadata.verifier) {
      verifier = await this.ctx.get<VerifyFunction.GenericAuthFn>(
        this.metadata.verifier,
      );
    }

    const name = this.metadata.strategy;
    if (name === STRATEGY.LOCAL) {
      const factory = this.ctx.getSync(
        Strategies.Passport.LOCAL_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.LOCAL_STRATEGY_FACTORY}`,
        );
      }
      return factory(
        this.metadata.options as
          | PassportLocal.IStrategyOptions
          | PassportLocal.IStrategyOptionsWithRequest,
        verifier as VerifyFunction.LocalPasswordFn,
      );
    } else if (name === STRATEGY.BEARER) {
      const factory = this.ctx.getSync(
        Strategies.Passport.BEARER_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.BEARER_STRATEGY_FACTORY}`,
        );
      }
      return factory(
        this.metadata.options as PassportBearer.IStrategyOptions,
        verifier as VerifyFunction.BearerFn,
      );
    } else if (name === STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT) {
      const factory = this.ctx.getSync(
        Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY}`,
        );
      }
      return factory(
        this.metadata
          .options as Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
        verifier as VerifyFunction.ResourceOwnerPasswordFn,
      );
    } else if (name === STRATEGY.GOOGLE_OAUTH2) {
      const factory = this.ctx.getSync(
        Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY}`,
        );
      }
      return factory.getGoogleAuthStrategyVerifier(
        this.metadata.options as
          | GoogleStrategy.StrategyOptions
          | GoogleStrategy.StrategyOptionsWithRequest,
        verifier as VerifyFunction.GoogleAuthFn,
      );
    } else if (name === STRATEGY.AZURE_AD) {
      const factory = this.ctx.getSync(
        Strategies.Passport.AZURE_AD_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.AZURE_AD_STRATEGY_FACTORY}`,
        );
      }
      return factory.getAzureADAuthStrategyVerifier(
        this.metadata.options as
          | AzureADAuthStrategy.IOIDCStrategyOptionWithRequest
          | AzureADAuthStrategy.IOIDCStrategyOptionWithoutRequest,
        verifier as VerifyFunction.AzureADAuthFn,
      );
    } else if (name === STRATEGY.KEYCLOAK) {
      const factory = this.ctx.getSync(
        Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY}`,
        );
      }
      return factory.getKeycloakAuthStrategyVerifier(
        this.metadata.options as Keycloak.StrategyOptions,
        verifier as VerifyFunction.KeycloakAuthFn,
      );
    } else if (name === STRATEGY.INSTAGRAM_OAUTH2) {
      const factory = this.ctx.getSync(
        Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY}`,
        );
      }
      return factory.getInstagramAuthStrategyVerifier(
        this.metadata.options as
          | InstagramStrategy.StrategyOption
          | InstagramStrategy.StrategyOptionWithRequest,
        verifier as VerifyFunction.InstagramAuthFn,
      );
    } else if (name === STRATEGY.APPLE_OAUTH2) {
      const factory = this.ctx.getSync(
        Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY}`,
        );
      }
      return factory.getAppleAuthStrategyVerifier(
        this.metadata.options as
          | AppleStrategy.AuthenticateOptions
          | AppleStrategy.AuthenticateOptionsWithRequest,
        verifier as VerifyFunction.AppleAuthFn,
      );
    } else if (name === STRATEGY.FACEBOOK_OAUTH2) {
      const factory = this.ctx.getSync(
        Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY}`,
        );
      }
      return factory.getFacebookAuthStrategyVerifier(
        this.metadata.options as
          | FacebookStrategy.StrategyOptionWithRequest
          | ExtendedStrategyOption,
        verifier as VerifyFunction.FacebookAuthFn,
      );
    } else if (name === STRATEGY.COGNITO_OAUTH2) {
      const factory = this.ctx.getSync(
        Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY}`,
        );
      }
      return factory.getCognitoAuthStrategyVerifier(
        this.metadata.options as Cognito.StrategyOptions,
        verifier as VerifyFunction.CognitoAuthFn,
      );
    } else if (name === STRATEGY.OTP) {
      const factory = this.ctx.getSync(
        Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY}`,
        );
      }
      return factory(
        this.metadata.options as Otp.StrategyOptions,
        verifier as VerifyFunction.OtpAuthFn,
      );
    } else if (name === STRATEGY.SAML) {
      const factory = this.ctx.getSync(
        Strategies.Passport.SAML_STRATEGY_FACTORY,
        {optional: true},
      );

      if (!factory) {
        throw new Error(
          `No factory found for ${Strategies.Passport.SAML_STRATEGY_FACTORY}`,
        );
      }
      return factory.getSamlStrategyVerifier(
        this.metadata.options as SamlConfig,
        verifier as VerifyFunction.SamlFn,
      );
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }
}
