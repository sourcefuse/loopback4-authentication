"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalVerifyProvider = void 0;
class LocalVerifyProvider {
    constructor() { }
    value() {
        return async (username, password, req) => {
            if (!username || !password) {
                return null;
            }
            if (username === '') {
                return null;
            }
            const userToPass = {
                id: 1,
                username,
                password,
            };
            return userToPass;
        };
    }
}
exports.LocalVerifyProvider = LocalVerifyProvider;
//# sourceMappingURL=local-password.provider.js.map