"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpVerifyProvider = void 0;
const rest_1 = require("@loopback/rest");
class OtpVerifyProvider {
    constructor() { }
    value() {
        return async (_key, _otp) => {
            throw new rest_1.HttpErrors.NotImplemented(`VerifyFunction.OtpAuthFn is not implemented`);
        };
    }
}
exports.OtpVerifyProvider = OtpVerifyProvider;
//# sourceMappingURL=otp-verify.provider.js.map