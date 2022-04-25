"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPasswordVerifyProvider = void 0;
class ClientPasswordVerifyProvider {
    constructor() { }
    value() {
        return async (clientId, clientSecret) => {
            if (clientId === '') {
                return null;
            }
            const clientToPass = {
                clientId: clientId || 'id',
                clientSecret: clientSecret || 'secret',
            };
            return clientToPass;
        };
    }
}
exports.ClientPasswordVerifyProvider = ClientPasswordVerifyProvider;
//# sourceMappingURL=passport-client.provider.js.map