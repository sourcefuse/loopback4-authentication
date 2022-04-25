"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPasswordStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const PassportLocal = tslib_1.__importStar(require("passport-local"));
const keys_1 = require("../../keys");
const lodash_1 = require("lodash");
let LocalPasswordStrategyFactoryProvider = class LocalPasswordStrategyFactoryProvider {
    constructor(verifierLocal) {
        this.verifierLocal = verifierLocal;
    }
    value() {
        return (options, verifier) => this.getLocalStrategyVerifier(options, verifier);
    }
    getLocalStrategyVerifier(options, verifierPassed) {
        const verifyFn = verifierPassed !== null && verifierPassed !== void 0 ? verifierPassed : this.verifierLocal;
        if (options === null || options === void 0 ? void 0 : options.passReqToCallback) {
            return new PassportLocal.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (req, username, password, cb) => {
                try {
                    const user = await verifyFn(username, password, req);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    cb(null, user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        else if (!!options && !(0, lodash_1.isEmpty)(options)) {
            return new PassportLocal.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (username, password, cb) => {
                try {
                    const user = await verifyFn(username, password);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    cb(null, user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        else {
            return new PassportLocal.Strategy(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (username, password, cb) => {
                try {
                    const user = await verifyFn(username, password, undefined);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    cb(null, user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
    }
};
LocalPasswordStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.Strategies.Passport.LOCAL_PASSWORD_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], LocalPasswordStrategyFactoryProvider);
exports.LocalPasswordStrategyFactoryProvider = LocalPasswordStrategyFactoryProvider;
//# sourceMappingURL=local-password-strategy-factory-provider.js.map