"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategies = void 0;
const core_1 = require("@loopback/core");
var Strategies;
(function (Strategies) {
    let Passport;
    (function (Passport) {
        // Passport-local strategy
        Passport.LOCAL_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.localPassword');
        Passport.LOCAL_PASSWORD_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.localPassword');
        // Passport-local-with-otp startegy
        Passport.OTP_AUTH_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.otpAuth');
        Passport.OTP_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.otpAuth');
        // Passport-oauth2-client-password strategy
        Passport.CLIENT_PASSWORD_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.clientPassword');
        Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.oauth2ClientPassword');
        // Passport-bearer strategy
        Passport.BEARER_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.bearer');
        Passport.BEARER_TOKEN_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.bearerToken');
        // Passport-oauth2-resource-owner-password strategy
        Passport.RESOURCE_OWNER_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.resourceOwnerPassword');
        Passport.RESOURCE_OWNER_PASSWORD_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.resourceOwnerPassword');
        // Passport-google-oauth2 strategy
        Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.googleOauth2');
        Passport.GOOGLE_OAUTH2_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.googleOauth2');
        Passport.AZURE_AD_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.azureAd');
        Passport.AZURE_AD_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.azureAd');
        // Passport-keycloak strategy
        Passport.KEYCLOAK_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.keycloak');
        Passport.KEYCLOAK_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.keycloak');
        // Passport-instagram startegy
        Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.instagramOauth2');
        Passport.INSTAGRAM_OAUTH2_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.instagramOauth2');
        // Passport-facebook startegy
        Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.facebookOauth2');
        Passport.FACEBOOK_OAUTH2_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.facebookOauth2');
        // Passport-apple-oauth2 strategy
        Passport.APPLE_OAUTH2_STRATEGY_FACTORY = core_1.BindingKey.create('sf.passport.strategyFactory.appleOauth2');
        Passport.APPLE_OAUTH2_VERIFIER = core_1.BindingKey.create('sf.passport.verifier.appleOauth2');
    })(Passport = Strategies.Passport || (Strategies.Passport = {}));
})(Strategies = exports.Strategies || (exports.Strategies = {}));
//# sourceMappingURL=keys.js.map