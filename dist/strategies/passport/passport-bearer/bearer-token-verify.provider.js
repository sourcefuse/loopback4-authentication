"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerTokenVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.BearerFn
 *
 * It will just throw an error saying Not Implemented
 */
class BearerTokenVerifyProvider {
    constructor() { }
    value() {
        return async (token) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.BearerFn is not implemented`);
        };
    }
}
exports.BearerTokenVerifyProvider = BearerTokenVerifyProvider;
//# sourceMappingURL=bearer-token-verify.provider.js.map