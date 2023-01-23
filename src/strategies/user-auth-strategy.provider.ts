import {Context, inject, Provider} from '@loopback/core';
import {Strategy} from 'passport';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as AzureADAuthStrategy from 'passport-azure-ad';
import * as PassportBearer from 'passport-http-bearer';
import * as PassportLocal from 'passport-local';
import * as InstagramStrategy from 'passport-instagram';
import * as FacebookStrategy from 'passport-facebook';
import * as AppleStrategy from 'passport-apple';
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
import {
  AppleAuthStrategyFactory,
  InstagramAuthStrategyFactory,
  KeycloakStrategyFactory,
  FacebookAuthStrategyFactory,
  PassportOtpStrategyFactory,
  Otp,
  CognitoAuthStrategyFactory,
} from './passport';
import {SamlStrategyFactory} from './SAML';
import {Cognito, Keycloak, VerifyFunction} from './types';
import {SamlConfig} from '@node-saml/passport-saml';

interface ExtendedStrategyOption extends FacebookStrategy.StrategyOption {
  passReqToCallback?: false;
}

export class AuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.USER_METADATA)
    private readonly metadata: AuthenticationMetadata,
    @inject(Strategies.Passport.LOCAL_STRATEGY_FACTORY)
    private readonly getLocalStrategyVerifier: LocalPasswordStrategyFactory,
    @inject(Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY)
    private readonly getOtpVerifier: PassportOtpStrategyFactory,
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
    @inject.context() private readonly ctx: Context,
    @inject(Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY)
    private readonly getInstagramAuthVerifier: InstagramAuthStrategyFactory,
    @inject(Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY)
    private readonly getFacebookAuthVerifier: FacebookAuthStrategyFactory,
    @inject(Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY)
    private readonly getAppleAuthVerifier: AppleAuthStrategyFactory,
    @inject(Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY)
    private readonly getCognitoAuthVerifier: CognitoAuthStrategyFactory,
    @inject(Strategies.SAML_STRATEGY_FACTORY)
    private readonly getSamlVerifier: SamlStrategyFactory,
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
      return this.getLocalStrategyVerifier(
        this.metadata.options as
          | PassportLocal.IStrategyOptions
          | PassportLocal.IStrategyOptionsWithRequest,
        verifier as VerifyFunction.LocalPasswordFn,
      );
    } else if (name === STRATEGY.BEARER) {
      return this.getBearerStrategyVerifier(
        this.metadata.options as PassportBearer.IStrategyOptions,
        verifier as VerifyFunction.BearerFn,
      );
    } else if (name === STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT) {
      return this.getResourceOwnerVerifier(
        this.metadata
          .options as Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
        verifier as VerifyFunction.ResourceOwnerPasswordFn,
      );
    } else if (name === STRATEGY.GOOGLE_OAUTH2) {
      return this.getGoogleAuthVerifier(
        this.metadata.options as
          | GoogleStrategy.StrategyOptions
          | GoogleStrategy.StrategyOptionsWithRequest,
        verifier as VerifyFunction.GoogleAuthFn,
      );
    } else if (name === STRATEGY.AZURE_AD) {
      return this.getAzureADAuthVerifier(
        this.metadata.options as
          | AzureADAuthStrategy.IOIDCStrategyOptionWithRequest
          | AzureADAuthStrategy.IOIDCStrategyOptionWithoutRequest,
        verifier as VerifyFunction.AzureADAuthFn,
      );
    } else if (name === STRATEGY.KEYCLOAK) {
      return this.getKeycloakVerifier(
        this.metadata.options as Keycloak.StrategyOptions,
        verifier as VerifyFunction.KeycloakAuthFn,
      );
    } else if (name === STRATEGY.INSTAGRAM_OAUTH2) {
      return this.getInstagramAuthVerifier(
        this.metadata.options as
          | InstagramStrategy.StrategyOption
          | InstagramStrategy.StrategyOptionWithRequest,
        verifier as VerifyFunction.InstagramAuthFn,
      );
    } else if (name === STRATEGY.APPLE_OAUTH2) {
      return this.getAppleAuthVerifier(
        this.metadata.options as
          | AppleStrategy.AuthenticateOptions
          | AppleStrategy.AuthenticateOptionsWithRequest,
        verifier as VerifyFunction.AppleAuthFn,
      );
    } else if (name === STRATEGY.FACEBOOK_OAUTH2) {
      return this.getFacebookAuthVerifier(
        this.metadata.options as
          | FacebookStrategy.StrategyOptionWithRequest
          | ExtendedStrategyOption,
        verifier as VerifyFunction.FacebookAuthFn,
      );
    } else if (name === STRATEGY.COGNITO_OAUTH2) {
      return this.getCognitoAuthVerifier(
        this.metadata.options as Cognito.StrategyOptions,
        verifier as VerifyFunction.CognitoAuthFn,
      );
    } else if (name === STRATEGY.OTP) {
      return this.getOtpVerifier(
        this.metadata.options as Otp.StrategyOptions,
        verifier as VerifyFunction.OtpAuthFn,
      );
    } else if (name === STRATEGY.SAML) {
      return this.getSamlVerifier(
        this.metadata.options as SamlConfig,
        verifier as VerifyFunction.SamlFn,
      );
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }
}
