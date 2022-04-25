"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const PassportBearer = tslib_1.__importStar(require("passport-http-bearer"));
const keys_1 = require("../../keys");
const lodash_1 = require("lodash");
let BearerStrategyFactoryProvider = class BearerStrategyFactoryProvider {
    constructor(verifierBearer) {
        this.verifierBearer = verifierBearer;
    }
    value() {
        return (options, verifier) => this.getBearerStrategyVerifier(options, verifier);
    }
    getBearerStrategyVerifier(options, verifierPassed) {
        const verifyFn = verifierPassed !== null && verifierPassed !== void 0 ? verifierPassed : this.verifierBearer;
        if (options === null || options === void 0 ? void 0 : options.passReqToCallback) {
            return new PassportBearer.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (req, token, cb) => {
                try {
                    const user = await verifyFn(token, req);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Token Invalid" /* TokenInvalid */);
                    }
                    cb(null, user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        else if (!!options && !(0, lodash_1.isEmpty)(options)) {
            return new PassportBearer.Strategy(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (token, cb) => {
                try {
                    const user = await verifyFn(token);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Token Invalid" /* TokenInvalid */);
                    }
                    cb(null, user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        else {
            return new PassportBearer.Strategy(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (token, cb) => {
                try {
                    const user = await verifyFn(token);
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
BearerStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.Strategies.Passport.BEARER_TOKEN_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], BearerStrategyFactoryProvider);
exports.BearerStrategyFactoryProvider = BearerStrategyFactoryProvider;
//# sourceMappingURL=bearer-strategy-factory-provider.js.map