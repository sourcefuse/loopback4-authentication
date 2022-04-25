"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class KeycloakVerifyProvider {
    constructor() { }
    value() {
        return async (accessToken, refreshToken, profile, cb) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.KeycloakAuthFn is not implemented`);
        };
    }
}
exports.KeycloakVerifyProvider = KeycloakVerifyProvider;
//# sourceMappingURL=keycloak-verify.provider.js.map