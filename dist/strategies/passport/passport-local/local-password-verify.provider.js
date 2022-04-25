"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPasswordVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
class LocalPasswordVerifyProvider {
    constructor() { }
    value() {
        return async (username, password) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.LocalPasswordFn is not implemented`);
        };
    }
}
exports.LocalPasswordVerifyProvider = LocalPasswordVerifyProvider;
//# sourceMappingURL=local-password-verify.provider.js.map