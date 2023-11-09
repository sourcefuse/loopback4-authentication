/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
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

    switch (name) {
      case STRATEGY.LOCAL:
        const localFactory = this.ctx.getSync(
          Strategies.Passport.LOCAL_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!localFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.LOCAL_STRATEGY_FACTORY}`,
          );
        }

        return localFactory(
          this.metadata.options as
            | PassportLocal.IStrategyOptions
            | PassportLocal.IStrategyOptionsWithRequest,
          verifier as VerifyFunction.LocalPasswordFn,
        );

      case STRATEGY.BEARER:
        const bearerFactory = this.ctx.getSync(
          Strategies.Passport.BEARER_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!bearerFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.BEARER_STRATEGY_FACTORY}`,
          );
        }

        return bearerFactory(
          this.metadata.options as PassportBearer.IStrategyOptions,
          verifier as VerifyFunction.BearerFn,
        );

      case STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT:
        const resourceOwnerFactory = this.ctx.getSync(
          Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!resourceOwnerFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY}`,
          );
        }

        return resourceOwnerFactory(
          this.metadata
            .options as Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
          verifier as VerifyFunction.ResourceOwnerPasswordFn,
        );

      case STRATEGY.GOOGLE_OAUTH2:
        const googleFactory = this.ctx.getSync(
          Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!googleFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY}`,
          );
        }

        return googleFactory(
          this.metadata.options as
            | GoogleStrategy.StrategyOptions
            | GoogleStrategy.StrategyOptionsWithRequest,
          verifier as VerifyFunction.GoogleAuthFn,
        );

      case STRATEGY.AZURE_AD:
        const azureFactory = this.ctx.getSync(
          Strategies.Passport.AZURE_AD_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!azureFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.AZURE_AD_STRATEGY_FACTORY}`,
          );
        }

        return azureFactory(
          this.metadata.options as
            | AzureADAuthStrategy.IOIDCStrategyOptionWithRequest
            | AzureADAuthStrategy.IOIDCStrategyOptionWithoutRequest,
          verifier as VerifyFunction.AzureADAuthFn,
        );

      case STRATEGY.KEYCLOAK:
        const keycloakFactory = this.ctx.getSync(
          Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!keycloakFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY}`,
          );
        }

        return keycloakFactory(
          this.metadata.options as Keycloak.StrategyOptions,
          verifier as VerifyFunction.KeycloakAuthFn,
        );

      case STRATEGY.INSTAGRAM_OAUTH2:
        const instagramFactory = this.ctx.getSync(
          Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!instagramFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY}`,
          );
        }

        return instagramFactory(
          this.metadata.options as
            | InstagramStrategy.StrategyOption
            | InstagramStrategy.StrategyOptionWithRequest,
          verifier as VerifyFunction.InstagramAuthFn,
        );

      case STRATEGY.APPLE_OAUTH2:
        const appleFactory = this.ctx.getSync(
          Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!appleFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY}`,
          );
        }
        return appleFactory(
          this.metadata.options as
            | AppleStrategy.AuthenticateOptions
            | AppleStrategy.AuthenticateOptionsWithRequest,
          verifier as VerifyFunction.AppleAuthFn,
        );

      case STRATEGY.FACEBOOK_OAUTH2:
        const facebookFactory = this.ctx.getSync(
          Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!facebookFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY}`,
          );
        }

        return facebookFactory(
          this.metadata.options as
            | FacebookStrategy.StrategyOptionWithRequest
            | ExtendedStrategyOption,
          verifier as VerifyFunction.FacebookAuthFn,
        );

      case STRATEGY.COGNITO_OAUTH2:
        const cognitoFactory = this.ctx.getSync(
          Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!cognitoFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY}`,
          );
        }

        return cognitoFactory(
          this.metadata.options as Cognito.StrategyOptions,
          verifier as VerifyFunction.CognitoAuthFn,
        );

      case STRATEGY.OTP:
        const otpFactory = this.ctx.getSync(
          Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!otpFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY}`,
          );
        }

        return otpFactory(
          this.metadata.options as Otp.StrategyOptions,
          verifier as VerifyFunction.OtpAuthFn,
        );

      case STRATEGY.SAML:
        const samlFactory = this.ctx.getSync(
          Strategies.Passport.SAML_STRATEGY_FACTORY,
          {optional: true},
        );

        if (!samlFactory) {
          throw new Error(
            `No factory found for ${Strategies.Passport.SAML_STRATEGY_FACTORY}`,
          );
        }

        return samlFactory(
          this.metadata.options as SamlConfig,
          verifier as VerifyFunction.SamlFn,
        );

      default:
        return Promise.reject(`The strategy ${name} is not available.`);
    }
  }
}
