"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakStrategyFactoryProvider = exports.KeycloakStrategy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const https_proxy_agent_1 = require("https-proxy-agent");
const keys_1 = require("../../keys");
exports.KeycloakStrategy = require('@exlinc/keycloak-passport');
let KeycloakStrategyFactoryProvider = class KeycloakStrategyFactoryProvider {
    constructor(verifierKeycloak) {
        this.verifierKeycloak = verifierKeycloak;
    }
    value() {
        return (options, verifier) => this.getKeycloakAuthStrategyVerifier(options, verifier);
    }
    getKeycloakAuthStrategyVerifier(options, verifierPassed) {
        const verifyFn = verifierPassed !== null && verifierPassed !== void 0 ? verifierPassed : this.verifierKeycloak;
        const strategy = new exports.KeycloakStrategy(options, async (accessToken, refreshToken, profile, cb) => {
            try {
                const user = await verifyFn(accessToken, refreshToken, profile, cb);
                if (!user) {
                    throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                }
                cb(undefined, user);
            }
            catch (err) {
                cb(err);
            }
        });
        // Override user profile fn of underlying library
        strategy.userProfile = (accessToken, done) => {
            this._userProfileFn(strategy, accessToken, done);
        };
        this._setupProxy(strategy);
        return strategy;
    }
    _userProfileFn(strategy, accessToken, done) {
        // Credits - https://github.com/exlinc/keycloak-passport/blob/eaa3859f83619d8e349e87193fdf8acc3a3d0ba9/index.js#L28
        strategy._oauth2._useAuthorizationHeaderForGET = true;
        strategy._oauth2.get(strategy.options.userInfoURL, accessToken, (err, body) => {
            if (err) {
                return done(err);
            }
            try {
                const json = JSON.parse(body);
                const email = json.email;
                const userInfo = {
                    keycloakId: json.sub,
                    fullName: json.name,
                    firstName: json.given_name,
                    lastName: json.family_name,
                    middleName: json.middle_name,
                    username: json.preferred_username,
                    email,
                    avatar: json.avatar,
                    realm: strategy.options.realm,
                    // add all attributes to userInfo
                    // overridden stuff
                    ...json,
                };
                // Remove duplicate keys
                for (const key of [
                    'sub',
                    'name',
                    'given_name',
                    'family_name',
                    'middle_name',
                    'preferred_username',
                ]) {
                    delete userInfo[key];
                }
                done(null, userInfo);
            }
            catch (e) {
                done(e);
            }
        });
    }
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
KeycloakStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.Strategies.Passport.KEYCLOAK_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], KeycloakStrategyFactoryProvider);
exports.KeycloakStrategyFactoryProvider = KeycloakStrategyFactoryProvider;
//# sourceMappingURL=keycloak-strategy-factory-provider.js.map