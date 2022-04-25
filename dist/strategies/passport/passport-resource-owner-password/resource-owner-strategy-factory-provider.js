"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceOwnerPasswordStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../../keys");
const oauth2_resource_owner_password_grant_1 = require("./oauth2-resource-owner-password-grant");
const lodash_1 = require("lodash");
let ResourceOwnerPasswordStrategyFactoryProvider = class ResourceOwnerPasswordStrategyFactoryProvider {
    constructor(verifierResourceOwner) {
        this.verifierResourceOwner = verifierResourceOwner;
    }
    value() {
        return (options, verifier) => this.getResourceOwnerVerifier(options, verifier);
    }
    getResourceOwnerVerifier(options, verifierPassed) {
        const verifyFn = verifierPassed !== null && verifierPassed !== void 0 ? verifierPassed : this.verifierResourceOwner;
        if (options === null || options === void 0 ? void 0 : options.passReqToCallback) {
            return new oauth2_resource_owner_password_grant_1.Oauth2ResourceOwnerPassword.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (req, clientId, clientSecret, username, password, cb) => {
                try {
                    const userInfo = await verifyFn(clientId, clientSecret, username, password, req);
                    if (!userInfo || (0, lodash_1.isEmpty)(userInfo)) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    cb(null, userInfo.client, userInfo.user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        else {
            return new oauth2_resource_owner_password_grant_1.Oauth2ResourceOwnerPassword.Strategy(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (clientId, clientSecret, username, password, cb) => {
                try {
                    const userInfo = await verifyFn(clientId, clientSecret, username, password);
                    if (!userInfo || (0, lodash_1.isEmpty)(userInfo)) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    cb(null, userInfo.client, userInfo.user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
    }
};
ResourceOwnerPasswordStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], ResourceOwnerPasswordStrategyFactoryProvider);
exports.ResourceOwnerPasswordStrategyFactoryProvider = ResourceOwnerPasswordStrategyFactoryProvider;
//# sourceMappingURL=resource-owner-strategy-factory-provider.js.map