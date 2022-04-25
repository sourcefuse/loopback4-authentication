"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramAuthVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class InstagramAuthVerifyProvider {
    constructor() { }
    value() {
        return async (accessToken, refreshToken, profile, cb, req) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.InstagramAuthFn is not implemented`);
        };
    }
}
exports.InstagramAuthVerifyProvider = InstagramAuthVerifyProvider;
//# sourceMappingURL=insta-auth-verify.provider.js.map