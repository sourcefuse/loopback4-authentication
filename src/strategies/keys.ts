import {BindingKey} from '@loopback/core';
import {LocalPasswordStrategyFactory} from './passport/passport-local';
import {BearerStrategyFactory} from './passport/passport-bearer';
import {ResourceOwnerPasswordStrategyFactory} from './passport/passport-resource-owner-password';
import {ClientPasswordStrategyFactory} from './passport/passport-client-password/client-password-strategy-factory-provider';
import {GoogleAuthStrategyFactoryProvider} from './passport/passport-google-oauth2';
import {KeycloakStrategyFactoryProvider} from './passport/passport-keycloak';
import {AzureADAuthStrategyFactoryProvider} from './passport/passport-azure-ad';
import {VerifyFunction} from './types';
import {InstagramAuthStrategyFactoryProvider} from './passport';
import {AppleAuthStrategyFactoryProvider} from './passport/passport-apple-oauth2';
import {FacebookAuthStrategyFactoryProvider} from './passport/passport-facebook-oauth2';
import {CognitoStrategyFactoryProvider} from './passport/passport-cognito-oauth2';
import {SamlStrategyFactoryProvider} from './SAML/saml-strategy-factory-provider';

export namespace Strategies {
  export namespace Passport {
    // Passport-local strategy
    export const LOCAL_STRATEGY_FACTORY =
      BindingKey.create<LocalPasswordStrategyFactory>(
        'sf.passport.strategyFactory.localPassword',
      );
    export const LOCAL_PASSWORD_VERIFIER =
      BindingKey.create<VerifyFunction.LocalPasswordFn>(
        'sf.passport.verifier.localPassword',
      );

    // Passport-local-with-otp startegy
    export const OTP_AUTH_STRATEGY_FACTORY =
      BindingKey.create<LocalPasswordStrategyFactory>(
        'sf.passport.strategyFactory.otpAuth',
      );
    export const OTP_VERIFIER =
      BindingKey.create<VerifyFunction.LocalPasswordFn>(
        'sf.passport.verifier.otpAuth',
      );

    // Passport-oauth2-client-password strategy
    export const CLIENT_PASSWORD_STRATEGY_FACTORY =
      BindingKey.create<ClientPasswordStrategyFactory>(
        'sf.passport.strategyFactory.clientPassword',
      );
    export const OAUTH2_CLIENT_PASSWORD_VERIFIER =
      BindingKey.create<VerifyFunction.OauthClientPasswordFn>(
        'sf.passport.verifier.oauth2ClientPassword',
      );

    // Passport-bearer strategy
    export const BEARER_STRATEGY_FACTORY =
      BindingKey.create<BearerStrategyFactory>(
        'sf.passport.strategyFactory.bearer',
      );
    export const BEARER_TOKEN_VERIFIER =
      BindingKey.create<VerifyFunction.BearerFn>(
        'sf.passport.verifier.bearerToken',
      );

    // Passport-oauth2-resource-owner-password strategy
    export const RESOURCE_OWNER_STRATEGY_FACTORY =
      BindingKey.create<ResourceOwnerPasswordStrategyFactory>(
        'sf.passport.strategyFactory.resourceOwnerPassword',
      );
    export const RESOURCE_OWNER_PASSWORD_VERIFIER =
      BindingKey.create<VerifyFunction.ResourceOwnerPasswordFn>(
        'sf.passport.verifier.resourceOwnerPassword',
      );

    // Passport-google-oauth2 strategy
    export const GOOGLE_OAUTH2_STRATEGY_FACTORY =
      BindingKey.create<GoogleAuthStrategyFactoryProvider>(
        'sf.passport.strategyFactory.googleOauth2',
      );
    export const GOOGLE_OAUTH2_VERIFIER =
      BindingKey.create<VerifyFunction.GoogleAuthFn>(
        'sf.passport.verifier.googleOauth2',
      );

    export const AZURE_AD_STRATEGY_FACTORY =
      BindingKey.create<AzureADAuthStrategyFactoryProvider>(
        'sf.passport.strategyFactory.azureAd',
      );
    export const AZURE_AD_VERIFIER =
      BindingKey.create<VerifyFunction.AzureADAuthFn>(
        'sf.passport.verifier.azureAd',
      );

    // Passport-keycloak strategy
    export const KEYCLOAK_STRATEGY_FACTORY =
      BindingKey.create<KeycloakStrategyFactoryProvider>(
        'sf.passport.strategyFactory.keycloak',
      );
    export const KEYCLOAK_VERIFIER =
      BindingKey.create<VerifyFunction.KeycloakAuthFn>(
        'sf.passport.verifier.keycloak',
      );

    // Passport-instagram startegy
    export const INSTAGRAM_OAUTH2_STRATEGY_FACTORY =
      BindingKey.create<InstagramAuthStrategyFactoryProvider>(
        'sf.passport.strategyFactory.instagramOauth2',
      );
    export const INSTAGRAM_OAUTH2_VERIFIER =
      BindingKey.create<VerifyFunction.InstagramAuthFn>(
        'sf.passport.verifier.instagramOauth2',
      );

    // Passport-facebook startegy
    export const FACEBOOK_OAUTH2_STRATEGY_FACTORY =
      BindingKey.create<FacebookAuthStrategyFactoryProvider>(
        'sf.passport.strategyFactory.facebookOauth2',
      );
    export const FACEBOOK_OAUTH2_VERIFIER =
      BindingKey.create<VerifyFunction.FacebookAuthFn>(
        'sf.passport.verifier.facebookOauth2',
      );

    // Passport-apple-oauth2 strategy
    export const APPLE_OAUTH2_STRATEGY_FACTORY =
      BindingKey.create<AppleAuthStrategyFactoryProvider>(
        'sf.passport.strategyFactory.appleOauth2',
      );
    export const APPLE_OAUTH2_VERIFIER =
      BindingKey.create<VerifyFunction.AppleAuthFn>(
        'sf.passport.verifier.appleOauth2',
      );

    // Passport-cognito-oauth2 strategy
    export const COGNITO_OAUTH2_STRATEGY_FACTORY =
      BindingKey.create<CognitoStrategyFactoryProvider>(
        'sf.passport.strategyFactory.cognitoOauth2',
      );
    export const COGNITO_OAUTH2_VERIFIER =
      BindingKey.create<VerifyFunction.CognitoAuthFn>(
        'sf.passport.verifier.cognitoOauth2',
      );
  }
  // SAML strategy
  export const SAML_STRATEGY_FACTORY =
    BindingKey.create<SamlStrategyFactoryProvider>(
      'sf.passport.strategyFactory.saml',
    );
  export const SAML_VERIFIER = BindingKey.create<VerifyFunction.SamlFn>(
    'sf.passport.verifier.saml',
  );
}
