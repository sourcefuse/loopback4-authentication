"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPasswordVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.OauthClientPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class ClientPasswordVerifyProvider {
    constructor() { }
    value() {
        return async (clientId, clientSecret) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.OauthClientPasswordFn is not implemented`);
        };
    }
}
exports.ClientPasswordVerifyProvider = ClientPasswordVerifyProvider;
//# sourceMappingURL=client-password-verify.provider.js.map