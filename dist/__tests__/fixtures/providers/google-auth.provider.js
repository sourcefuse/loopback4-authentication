"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerTokenVerifyProvider = void 0;
class BearerTokenVerifyProvider {
    constructor() { }
    value() {
        return async (accessToken, refreshToken, profile, cb, req) => {
            const userToPass = {
                id: 1,
                username: 'xyz',
                password: 'pass',
            };
            return userToPass;
        };
    }
}
exports.BearerTokenVerifyProvider = BearerTokenVerifyProvider;
//# sourceMappingURL=google-auth.provider.js.map