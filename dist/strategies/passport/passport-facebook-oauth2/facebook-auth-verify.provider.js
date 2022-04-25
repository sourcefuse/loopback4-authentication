"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookAuthVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class FacebookAuthVerifyProvider {
    constructor() { }
    value() {
        return async (accessToken, refreshToken, profile, cb, req) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.FacebookAuthFn is not implemented`);
        };
    }
}
exports.FacebookAuthVerifyProvider = FacebookAuthVerifyProvider;
//# sourceMappingURL=facebook-auth-verify.provider.js.map