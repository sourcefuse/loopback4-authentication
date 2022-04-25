"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class GoogleAuthVerifyProvider {
    constructor() { }
    value() {
        return async (accessToken, refreshToken, profile, cb, req) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.GoogleAuthFn is not implemented`);
        };
    }
}
exports.GoogleAuthVerifyProvider = GoogleAuthVerifyProvider;
//# sourceMappingURL=google-auth-verify.provider.js.map