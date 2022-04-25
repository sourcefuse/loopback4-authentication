"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleAuthStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const https_proxy_agent_1 = require("https-proxy-agent");
const keys_1 = require("../../keys");
const passport_apple_1 = tslib_1.__importDefault(require("passport-apple"));
let AppleAuthStrategyFactoryProvider = class AppleAuthStrategyFactoryProvider {
    constructor(verifierAppleAuth) {
        this.verifierAppleAuth = verifierAppleAuth;
    }
    value() {
        return (options, verifier) => this.getAppleAuthStrategyVerifier(options, verifier);
    }
    getAppleAuthStrategyVerifier(options, verifierPassed) {
        const verifyFn = verifierPassed !== null && verifierPassed !== void 0 ? verifierPassed : this.verifierAppleAuth;
        let strategy;
        if (options && options.passReqToCallback === true) {
            strategy = new passport_apple_1.default(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (req, accessToken, refreshToken, decodedIdToken, profile, cb) => {
                try {
                    const user = await verifyFn(accessToken, refreshToken, decodedIdToken, profile, cb, req);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    cb(undefined, user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        else {
            strategy = new passport_apple_1.default(options, 
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (accessToken, refreshToken, decodedIdToken, profile, cb) => {
                try {
                    const user = await verifyFn(accessToken, refreshToken, decodedIdToken, profile, cb);
                    if (!user) {
                        throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                    }
                    cb(undefined, user);
                }
                catch (err) {
                    cb(err);
                }
            });
        }
        this._setupProxy(strategy);
        return strategy;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _setupProxy(strategy) {
        // Setup proxy if any
        let httpsProxyAgent;
        if (process.env['https_proxy']) {
            httpsProxyAgent = new https_proxy_agent_1.HttpsProxyAgent(process.env['https_proxy']);
            strategy._oauth2.setAgent(httpsProxyAgent);
        }
        else if (process.env['HTTPS_PROXY']) {
            httpsProxyAgent = new https_proxy_agent_1.HttpsProxyAgent(process.env['HTTPS_PROXY']);
            strategy._oauth2.setAgent(httpsProxyAgent);
        }
    }
};
AppleAuthStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.Strategies.Passport.APPLE_OAUTH2_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], AppleAuthStrategyFactoryProvider);
exports.AppleAuthStrategyFactoryProvider = AppleAuthStrategyFactoryProvider;
//# sourceMappingURL=apple-auth-strategy-factory-provider.js.map