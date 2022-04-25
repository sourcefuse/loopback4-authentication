"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationComponent = void 0;
const keys_1 = require("./keys");
const providers_1 = require("./providers");
const strategies_1 = require("./strategies");
const keys_2 = require("./strategies/keys");
class AuthenticationComponent {
    constructor() {
        this.providers = {
            [keys_1.AuthenticationBindings.USER_AUTH_ACTION.key]: providers_1.AuthenticateActionProvider,
            [keys_1.AuthenticationBindings.CLIENT_AUTH_ACTION.key]: providers_1.ClientAuthenticateActionProvider,
            [keys_1.AuthenticationBindings.USER_METADATA.key]: providers_1.AuthMetadataProvider,
            [keys_1.AuthenticationBindings.CLIENT_METADATA.key]: providers_1.ClientAuthMetadataProvider,
            [keys_1.AuthenticationBindings.USER_STRATEGY.key]: strategies_1.AuthStrategyProvider,
            [keys_1.AuthenticationBindings.CLIENT_STRATEGY.key]: strategies_1.ClientAuthStrategyProvider,
            // Strategy function factories
            [keys_2.Strategies.Passport.LOCAL_STRATEGY_FACTORY.key]: strategies_1.LocalPasswordStrategyFactoryProvider,
            [keys_2.Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY.key]: strategies_1.PassportOtpStrategyFactoryProvider,
            [keys_2.Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY.key]: strategies_1.ClientPasswordStrategyFactoryProvider,
            [keys_2.Strategies.Passport.BEARER_STRATEGY_FACTORY.key]: strategies_1.BearerStrategyFactoryProvider,
            [keys_2.Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY.key]: strategies_1.ResourceOwnerPasswordStrategyFactoryProvider,
            [keys_2.Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY.key]: strategies_1.GoogleAuthStrategyFactoryProvider,
            [keys_2.Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY.key]: strategies_1.InstagramAuthStrategyFactoryProvider,
            [keys_2.Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY.key]: strategies_1.FacebookAuthStrategyFactoryProvider,
            [keys_2.Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY.key]: strategies_1.AppleAuthStrategyFactoryProvider,
            [keys_2.Strategies.Passport.AZURE_AD_STRATEGY_FACTORY.key]: strategies_1.AzureADAuthStrategyFactoryProvider,
            [keys_2.Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY.key]: strategies_1.KeycloakStrategyFactoryProvider,
            // Verifier functions
            [keys_2.Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER.key]: strategies_1.ClientPasswordVerifyProvider,
            [keys_2.Strategies.Passport.LOCAL_PASSWORD_VERIFIER.key]: strategies_1.LocalPasswordVerifyProvider,
            [keys_2.Strategies.Passport.OTP_VERIFIER.key]: strategies_1.OtpVerifyProvider,
            [keys_2.Strategies.Passport.BEARER_TOKEN_VERIFIER.key]: strategies_1.BearerTokenVerifyProvider,
            [keys_2.Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER.key]: strategies_1.ResourceOwnerVerifyProvider,
            [keys_2.Strategies.Passport.GOOGLE_OAUTH2_VERIFIER.key]: strategies_1.GoogleAuthVerifyProvider,
            [keys_2.Strategies.Passport.INSTAGRAM_OAUTH2_VERIFIER.key]: strategies_1.InstagramAuthVerifyProvider,
            [keys_2.Strategies.Passport.FACEBOOK_OAUTH2_VERIFIER.key]: strategies_1.FacebookAuthVerifyProvider,
            [keys_2.Strategies.Passport.APPLE_OAUTH2_VERIFIER.key]: strategies_1.AppleAuthVerifyProvider,
            [keys_2.Strategies.Passport.AZURE_AD_VERIFIER.key]: strategies_1.AzureADAuthVerifyProvider,
            [keys_2.Strategies.Passport.KEYCLOAK_VERIFIER.key]: strategies_1.KeycloakVerifyProvider,
        };
    }
}
exports.AuthenticationComponent = AuthenticationComponent;
//# sourceMappingURL=component.js.map