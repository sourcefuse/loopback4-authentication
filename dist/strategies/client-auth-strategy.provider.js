"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAuthStrategyProvider = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
const keys_2 = require("./keys");
let ClientAuthStrategyProvider = class ClientAuthStrategyProvider {
    constructor(clientMetadata, getClientPasswordVerifier) {
        this.clientMetadata = clientMetadata;
        this.getClientPasswordVerifier = getClientPasswordVerifier;
    }
    value() {
        if (!this.clientMetadata) {
            return undefined;
        }
        const name = this.clientMetadata.strategy;
        if (name === "client-password" /* CLIENT_PASSWORD */) {
            return this.getClientPasswordVerifier(this.clientMetadata.options);
        }
        else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }
};
ClientAuthStrategyProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)(keys_1.AuthenticationBindings.CLIENT_METADATA)),
    tslib_1.__param(1, (0, context_1.inject)(keys_2.Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY)),
    tslib_1.__metadata("design:paramtypes", [Object, Function])
], ClientAuthStrategyProvider);
exports.ClientAuthStrategyProvider = ClientAuthStrategyProvider;
//# sourceMappingURL=client-auth-strategy.provider.js.map