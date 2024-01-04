/* eslint-disable @typescript-eslint/naming-convention */
import {Context, inject, Provider} from '@loopback/core';
import {SamlConfig} from '@node-saml/passport-saml';
import {Strategy} from 'passport';
import * as AppleStrategy from 'passport-apple';
import * as AzureADAuthStrategy from 'passport-azure-ad';
import * as FacebookStrategy from 'passport-facebook';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as PassportBearer from 'passport-http-bearer';
import * as InstagramStrategy from 'passport-instagram';
import * as PassportLocal from 'passport-local';
import {AuthenticationBindings} from '../keys';
import {STRATEGY} from '../strategy-name.enum';
import {AuthenticationMetadata, IAuthUser} from '../types';
import {Strategies} from './keys';
import {Otp} from './passport';
import {LocalPasswordStrategyFactory} from './passport/passport-local';
import {Oauth2ResourceOwnerPassword} from './passport/passport-resource-owner-password';
import {Cognito, Keycloak, VerifyFunction} from './types';

interface ExtendedStrategyOption extends FacebookStrategy.StrategyOption {
  passReqToCallback?: false;
}

export type VerifierType =
  | LocalPasswordStrategyFactory
  | VerifyFunction.LocalPasswordFn<IAuthUser>
  | undefined;
export class AuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.USER_METADATA)
    private readonly metadata: AuthenticationMetadata,
    @inject.context() private readonly ctx: Context,
  ) {}

  async processLocalFactory(verifier: VerifierType) {
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
  }

  async processBearerFactory(verifier: VerifierType) {
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
  }

  async processResourceOwnerFactory(verifier: VerifierType) {
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
  }

  async processGoogleFactory(verifier: VerifierType) {
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
  }

  async processAzureFactory(verifier: VerifierType) {
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
  }

  async processKeycloakFactory(verifier: VerifierType) {
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
  }

  async processInstagramFactory(verifier: VerifierType) {
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
  }

  async processAppleFactory(verifier: VerifierType) {
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
  }

  async processFacebookFactory(verifier: VerifierType) {
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
  }

  processCognitoFactory(verifier: VerifierType) {
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
  }

  async processOtpAuthFactory(verifier: VerifierType) {
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
  }

  async processSamlFactory(verifier: VerifierType) {
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
  }

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
      case STRATEGY.LOCAL: {
        return this.processLocalFactory(verifier);
      }
      case STRATEGY.BEARER: {
        return this.processBearerFactory(verifier);
      }
      case STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT: {
        return this.processResourceOwnerFactory(verifier);
      }
      case STRATEGY.GOOGLE_OAUTH2: {
        return this.processGoogleFactory(verifier);
      }
      case STRATEGY.AZURE_AD: {
        return this.processAzureFactory(verifier);
      }
      case STRATEGY.KEYCLOAK: {
        return this.processKeycloakFactory(verifier);
      }
      case STRATEGY.INSTAGRAM_OAUTH2: {
        return this.processInstagramFactory(verifier);
      }
      case STRATEGY.APPLE_OAUTH2: {
        return this.processAppleFactory(verifier);
      }
      case STRATEGY.FACEBOOK_OAUTH2: {
        return this.processFacebookFactory(verifier);
      }
      case STRATEGY.COGNITO_OAUTH2: {
        return this.processCognitoFactory(verifier);
      }

      case STRATEGY.OTP: {
        return this.processOtpAuthFactory(verifier);
      }
      case STRATEGY.SAML: {
        return this.processSamlFactory(verifier);
      }
      default:
        return Promise.reject(
          new Error(`The strategy ${name} is not available.`),
        );
    }
  }
}
