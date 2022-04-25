"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAuthenticateActionProvider = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
const strategy_adapter_1 = require("../strategy-adapter");
const lodash_1 = require("lodash");
let ClientAuthenticateActionProvider = class ClientAuthenticateActionProvider {
    constructor(getStrategy, setCurrentClient) {
        this.getStrategy = getStrategy;
        this.setCurrentClient = setCurrentClient;
    }
    value() {
        return (request) => this.action(request);
    }
    async action(request) {
        const strategy = await this.getStrategy();
        if (!strategy) {
            this.setCurrentClient(undefined);
            return undefined;
        }
        if (!strategy.authenticate) {
            throw new Error('invalid strategy parameter');
        }
        const strategyAdapter = new strategy_adapter_1.StrategyAdapter(strategy);
        // Added for cases, where data is passed not in body but in query parameter
        if (!request.body || !(0, lodash_1.isObjectLike)(request.body) || (0, lodash_1.isEmpty)(request.body)) {
            request.body = request.query;
        }
        const client = await strategyAdapter.authenticate(request);
        if (client) {
            this.setCurrentClient(client);
            return client;
        }
    }
};
ClientAuthenticateActionProvider = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject.getter(keys_1.AuthenticationBindings.CLIENT_STRATEGY)),
    tslib_1.__param(1, context_1.inject.setter(keys_1.AuthenticationBindings.CURRENT_CLIENT)),
    tslib_1.__metadata("design:paramtypes", [Function, Function])
], ClientAuthenticateActionProvider);
exports.ClientAuthenticateActionProvider = ClientAuthenticateActionProvider;
//# sourceMappingURL=client-authentication.provider.js.map