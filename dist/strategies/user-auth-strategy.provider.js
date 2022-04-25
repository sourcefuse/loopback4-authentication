"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStrategyProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const keys_2 = require("./keys");
let AuthStrategyProvider = class AuthStrategyProvider {
    constructor(metadata, getLocalStrategyVerifier, getOtpVerifier, getBearerStrategyVerifier, getResourceOwnerVerifier, getGoogleAuthVerifier, getAzureADAuthVerifier, getKeycloakVerifier, ctx, getInstagramAuthVerifier, getFacebookAuthVerifier, getAppleAuthVerifier) {
        this.metadata = metadata;
        this.getLocalStrategyVerifier = getLocalStrategyVerifier;
        this.getOtpVerifier = getOtpVerifier;
        this.getBearerStrategyVerifier = getBearerStrategyVerifier;
        this.getResourceOwnerVerifier = getResourceOwnerVerifier;
        this.getGoogleAuthVerifier = getGoogleAuthVerifier;
        this.getAzureADAuthVerifier = getAzureADAuthVerifier;
        this.getKeycloakVerifier = getKeycloakVerifier;
        this.ctx = ctx;
        this.getInstagramAuthVerifier = getInstagramAuthVerifier;
        this.getFacebookAuthVerifier = getFacebookAuthVerifier;
        this.getAppleAuthVerifier = getAppleAuthVerifier;
    }
    async value() {
        if (!this.metadata) {
            return undefined;
        }
        //check if custom verifier binding is provided in the metadata
        let verifier;
        if (this.metadata.verifier) {
            verifier = await this.ctx.get(this.metadata.verifier);
        }
        const name = this.metadata.strategy;
        if (name === "local" /* LOCAL */) {
            return this.getLocalStrategyVerifier(this.metadata.options, verifier);
        }
        else if (name === "bearer" /* BEARER */) {
            return this.getBearerStrategyVerifier(this.metadata.options, verifier);
        }
        else if (name === "OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */) {
            return this.getResourceOwnerVerifier(this.metadata
                .options, verifier);
        }
        else if (name === "Google Oauth 2.0" /* GOOGLE_OAUTH2 */) {
            return this.getGoogleAuthVerifier(this.metadata.options, verifier);
        }
        else if (name === "Azure AD" /* AZURE_AD */) {
            return this.getAzureADAuthVerifier(this.metadata.options, verifier);
        }
        else if (name === "keycloak" /* KEYCLOAK */) {
            return this.getKeycloakVerifier(this.metadata.options, verifier);
        }
        else if (name === "Instagram Oauth 2.0" /* INSTAGRAM_OAUTH2 */) {
            return this.getInstagramAuthVerifier(this.metadata.options, verifier);
        }
        else if (name === "Apple Oauth 2.0" /* APPLE_OAUTH2 */) {
            return this.getAppleAuthVerifier(this.metadata.options, verifier);
        }
        else if (name === "Facebook Oauth 2.0" /* FACEBOOK_OAUTH2 */) {
            return this.getFacebookAuthVerifier(this.metadata.options, verifier);
        }
        else if (name === "otp" /* OTP */) {
            return this.getOtpVerifier(this.metadata.options, verifier);
        }
        else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }
};
AuthStrategyProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.AuthenticationBindings.USER_METADATA)),
    tslib_1.__param(1, (0, core_1.inject)(keys_2.Strategies.Passport.LOCAL_STRATEGY_FACTORY)),
    tslib_1.__param(2, (0, core_1.inject)(keys_2.Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY)),
    tslib_1.__param(3, (0, core_1.inject)(keys_2.Strategies.Passport.BEARER_STRATEGY_FACTORY)),
    tslib_1.__param(4, (0, core_1.inject)(keys_2.Strategies.Passport.RESOURCE_OWNER_STRATEGY_FACTORY)),
    tslib_1.__param(5, (0, core_1.inject)(keys_2.Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY)),
    tslib_1.__param(6, (0, core_1.inject)(keys_2.Strategies.Passport.AZURE_AD_STRATEGY_FACTORY)),
    tslib_1.__param(7, (0, core_1.inject)(keys_2.Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY)),
    tslib_1.__param(8, core_1.inject.context()),
    tslib_1.__param(9, (0, core_1.inject)(keys_2.Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY)),
    tslib_1.__param(10, (0, core_1.inject)(keys_2.Strategies.Passport.FACEBOOK_OAUTH2_STRATEGY_FACTORY)),
    tslib_1.__param(11, (0, core_1.inject)(keys_2.Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY)),
    tslib_1.__metadata("design:paramtypes", [Object, Function, Function, Function, Function, Function, Function, Function, core_1.Context, Function, Function, Function])
], AuthStrategyProvider);
exports.AuthStrategyProvider = AuthStrategyProvider;
//# sourceMappingURL=user-auth-strategy.provider.js.map