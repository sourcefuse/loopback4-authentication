"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceOwnerVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of
 * VerifyFunction.ResourceOwnerPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class ResourceOwnerVerifyProvider {
    constructor() { }
    value() {
        return async (clientId, clientSecret, username, password) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.ResourceOwnerPasswordFn is not implemented`);
        };
    }
}
exports.ResourceOwnerVerifyProvider = ResourceOwnerVerifyProvider;
//# sourceMappingURL=resource-owner-verify.provider.js.map