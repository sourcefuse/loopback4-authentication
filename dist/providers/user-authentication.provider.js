"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateActionProvider = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../keys");
const strategy_adapter_1 = require("../strategy-adapter");
let AuthenticateActionProvider = class AuthenticateActionProvider {
    constructor(getStrategy, getMetadata, setCurrentUser) {
        this.getStrategy = getStrategy;
        this.getMetadata = getMetadata;
        this.setCurrentUser = setCurrentUser;
    }
    value() {
        return (request, response) => this.action(request, response);
    }
    async action(request, response) {
        const strategy = await this.getStrategy();
        if (!strategy) {
            this.setCurrentUser(undefined);
            return undefined;
        }
        if (!strategy.authenticate) {
            throw new rest_1.HttpErrors.Unauthorized("Unknown Error" /* UnknownError */);
        }
        // Read decorator metadata to fetch options
        // to be passed on to authenticate method of strategy
        const metadata = await this.getMetadata();
        let authOpts;
        if (metadata === null || metadata === void 0 ? void 0 : metadata.authOptions) {
            // Fetch options using creator function added with decorator definition
            authOpts = metadata.authOptions(request);
        }
        const strategyAdapter = new strategy_adapter_1.StrategyAdapter(strategy);
        const user = await strategyAdapter.authenticate(request, response, authOpts);
        if (user) {
            this.setCurrentUser(user);
            return user;
        }
    }
};
AuthenticateActionProvider = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject.getter(keys_1.AuthenticationBindings.USER_STRATEGY)),
    tslib_1.__param(1, context_1.inject.getter(keys_1.AuthenticationBindings.USER_METADATA)),
    tslib_1.__param(2, context_1.inject.setter(keys_1.AuthenticationBindings.CURRENT_USER)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function])
], AuthenticateActionProvider);
exports.AuthenticateActionProvider = AuthenticateActionProvider;
//# sourceMappingURL=user-authentication.provider.js.map