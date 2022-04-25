"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleAuthVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
class AppleAuthVerifyProvider {
    constructor() { }
    value() {
        return async (accessToken, refreshToken, decodedIdToken, profile, cb, req) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.AppleAuthFn is not implemented`);
        };
    }
}
exports.AppleAuthVerifyProvider = AppleAuthVerifyProvider;
//# sourceMappingURL=apple-auth-verify.provider.js.map