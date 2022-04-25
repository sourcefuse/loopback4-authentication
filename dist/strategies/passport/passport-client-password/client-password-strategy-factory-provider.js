"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPasswordStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const ClientPasswordStrategy = tslib_1.__importStar(require("passport-oauth2-client-password"));
const keys_1 = require("../../keys");
let ClientPasswordStrategyFactoryProvider = class ClientPasswordStrategyFactoryProvider {
    constructor(verifier) {
        this.verifier = verifier;
    }
    value() {
        return (options, verifier) => this.getClientPasswordVerifier(options, verifier);
    }
    getClientPasswordVerifier(options, verifierPassed) {
        const verifyFn = verifierPassed !== null && verifierPassed !== void 0 ? verifierPassed : this.verifier;
        if (options === null || options === void 0 ? void 0 : options.passReqToCallback) {
            return new ClientPasswordStrategy.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (req, clientId, clientSecret, cb) => {
                try {
                    const client = await verifyFn(clientId, clientSecret, req);
                    if (!client) {
                        throw new rest_1.HttpErrors.Unauthorized("Client Invalid" /* ClientInvalid */);
                    }
                    else if (!client.clientSecret ||
                        client.clientSecret !== clientSecret) {
                        throw new rest_1.HttpErrors.Unauthorized("Client Verification Failed" /* ClientVerificationFailed */);
                    }
                    cb(null, client);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        else {
            return new ClientPasswordStrategy.Strategy(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (clientId, clientSecret, cb) => {
                try {
                    const client = await verifyFn(clientId, clientSecret);
                    if (!client) {
                        throw new rest_1.HttpErrors.Unauthorized("Client Invalid" /* ClientInvalid */);
                    }
                    else if (!client.clientSecret ||
                        client.clientSecret !== clientSecret) {
                        throw new rest_1.HttpErrors.Unauthorized("Client Verification Failed" /* ClientVerificationFailed */);
                    }
                    cb(null, client);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
    }
};
ClientPasswordStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], ClientPasswordStrategyFactoryProvider);
exports.ClientPasswordStrategyFactoryProvider = ClientPasswordStrategyFactoryProvider;
//# sourceMappingURL=client-password-strategy-factory-provider.js.map