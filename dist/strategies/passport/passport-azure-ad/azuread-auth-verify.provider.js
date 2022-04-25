"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureADAuthVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class AzureADAuthVerifyProvider {
    constructor() { }
    value() {
        return async (profile, done, req) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.AzureADAuthFn is not implemented`);
        };
    }
}
exports.AzureADAuthVerifyProvider = AzureADAuthVerifyProvider;
//# sourceMappingURL=azuread-auth-verify.provider.js.map