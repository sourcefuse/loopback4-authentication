"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceOwnerVerifyProvider = void 0;
class ResourceOwnerVerifyProvider {
    constructor() { }
    value() {
        return async (clientId, clientSecret, username, password, req) => {
            if (username === '' || clientId === '') {
                return null;
            }
            const userToPass = {
                id: 1,
                username: username || 'xyz',
                password: password || 'pass',
            };
            const clientToPass = {
                clientId: clientId || 'client id',
                clientSecret: clientSecret || 'client secret',
            };
            return { user: userToPass, client: clientToPass };
        };
    }
}
exports.ResourceOwnerVerifyProvider = ResourceOwnerVerifyProvider;
//# sourceMappingURL=resource-owner.provider.js.map