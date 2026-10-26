import {BindingKey, Context, inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SamlConfig} from '@node-saml/passport-saml';
import {Strategy} from 'passport';
import * as AppleStrategy from 'passport-apple';
import * as AzureADAuthStrategy from 'passport-azure-ad';
import * as FacebookStrategy from 'passport-facebook';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as PassportBearer from 'passport-http-bearer';
import * as InstagramStrategy from 'passport-instagram';
import * as PassportLocal from 'passport-local';
import * as Auth0Strategy from 'passport-auth0';
import {AuthErrorKeys} from '../error-keys';
import {AuthenticationBindings} from '../keys';
import {STRATEGY} from '../strategy-name.enum';
import {AuthenticationMetadata, IAuthUser} from '../types';
import {Strategies} from './keys';
import {LocalPasswordStrategyFactory} from './passport/passport-local';
import {Otp} from './passport/passport-otp';
import {Oauth2ResourceOwnerPassword} from './passport/passport-resource-owner-password';
import {Auth0, Cognito, Keycloak, VerifyFunction} from './types';

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

  /**
   * An unbound factory is a supported setup (passport packages are optional),
   * so it is answered like an unregistered route rather than as a server fault.
   */
  private getFactory<T>(key: BindingKey<T>): T {
    const factory = this.ctx.getSync(key, {optional: true});
    if (!factory) {
      throw new HttpErrors.NotFound(AuthErrorKeys.StrategyNotAvailable);
    }
    return factory;
  }

  processLocalFactory(verifier: VerifierType) {
    const localFactory = this.getFactory(
      Strategies.Passport.LOCAL_STRATEGY_FACTORY,
    );

    return localFactory(
      this.metadata.options as
        | PassportLocal.IStrategyOptions
        | PassportLocal.IStrategyOptionsWithRequest,
      verifier as VerifyFunction.LocalPasswordFn,
    );
  }

  processBearerFactory(verifier: VerifierType) {
    const bearerFactory = this.getFactory(
      Strategies.Passport.BEARER_STRATEGY_FACTORY,
    );

    return bearerFactory(
      this.metadata.options as PassportBearer.IStrategyOptions,
      verifier as VerifyFunction.BearerFn,
    );
  }

  processResourceOwnerFactory(verifier: VerifierType) {
    const resourceOwnerFactory = this.getFactory(
      Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY,
    );

    return resourceOwnerFactory(
      this.metadata
        .options as Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
      verifier as VerifyFunction.ResourceOwnerPasswordFn,
    );
  }

  processGoogleFactory(verifier: VerifierType) {
    const googleFactory = this.getFactory(
      Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY,
    );

    return googleFactory(
      this.metadata.options as
        | GoogleStrategy.StrategyOptions
        | GoogleStrategy.StrategyOptionsWithRequest,
      verifier as VerifyFunction.GoogleAuthFn,
    );
  }

  processAzureFactory(verifier: VerifierType) {
    const azureFactory = this.getFactory(
      Strategies.Passport.AZURE_AD_STRATEGY_FACTORY,
    );

    return azureFactory(
      this.metadata.options as
        | AzureADAuthStrategy.IOIDCStrategyOptionWithRequest
        | AzureADAuthStrategy.IOIDCStrategyOptionWithoutRequest,
      verifier as VerifyFunction.AzureADAuthFn,
    );
  }

  processKeycloakFactory(verifier: VerifierType) {
    const keycloakFactory = this.getFactory(
      Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY,
    );

    return keycloakFactory(
      this.metadata.options as Keycloak.StrategyOptions,
      verifier as VerifyFunction.KeycloakAuthFn,
    );
  }

  processInstagramFactory(verifier: VerifierType) {
    const instagramFactory = this.getFactory(
      Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY,
    );

    return instagramFactory(
      this.metadata.options as
        | InstagramStrategy.StrategyOption
        | InstagramStrategy.StrategyOptionWithRequest,
      verifier as VerifyFunction.InstagramAuthFn,
    );
  }

  processAppleFactory(verifier: VerifierType) {
    const appleFactory = this.getFactory(
      Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY,
    );
    return appleFactory(
      this.metadata.options as
        | AppleStrategy.AuthenticateOptions
        | AppleStrategy.AuthenticateOptionsWithRequest,
      verifier as VerifyFunction.AppleAuthFn,
    );
  }

  processFacebookFactory(verifier: VerifierType) {
    const facebookFactory = this.getFactory(
      Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY,
    );

    return facebookFactory(
      this.metadata.options as
        FacebookStrategy.StrategyOptionWithRequest | ExtendedStrategyOption,
      verifier as VerifyFunction.FacebookAuthFn,
    );
  }

  processCognitoFactory(verifier: VerifierType) {
    const cognitoFactory = this.getFactory(
      Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY,
    );

    return cognitoFactory(
      this.metadata.options as Cognito.StrategyOptions,
      verifier as VerifyFunction.CognitoAuthFn,
    );
  }

  processOtpAuthFactory(verifier: VerifierType) {
    const otpFactory = this.getFactory(
      Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY,
    );

    return otpFactory(
      this.metadata.options as Otp.StrategyOptions,
      verifier as VerifyFunction.OtpAuthFn,
    );
  }
  processAuth0Factory(verifier: VerifierType) {
    const auth0Factory = this.getFactory(
      Strategies.Passport.AUTH0_STRATEGY_FACTORY,
    );

    // Cast the factory output to `Strategy` type
    return auth0Factory(
      this.metadata.options as
        Auth0.Auth0StrategyOptions | Auth0Strategy.StrategyOptionWithRequest,
      verifier as VerifyFunction.Auth0Fn,
    );
  }

  processSamlFactory(verifier: VerifierType) {
    const samlFactory = this.getFactory(
      Strategies.Passport.SAML_STRATEGY_FACTORY,
    );

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
      case STRATEGY.AUTH0: {
        return this.processAuth0Factory(verifier);
      }
      default:
        return Promise.reject(
          new HttpErrors.NotFound(AuthErrorKeys.StrategyNotAvailable),
        );
    }
  }
}
