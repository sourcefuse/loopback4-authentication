"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerTokenVerifyProvider = void 0;
class BearerTokenVerifyProvider {
    constructor() { }
    value() {
        return async (profile, done, req) => {
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
//# sourceMappingURL=azuread-auth.provider.js.map