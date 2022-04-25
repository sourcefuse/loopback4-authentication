"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportOtpStrategyFactoryProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../../keys");
const otp_auth_1 = require("./otp-auth");
let PassportOtpStrategyFactoryProvider = class PassportOtpStrategyFactoryProvider {
    constructor(verifierOtp) {
        this.verifierOtp = verifierOtp;
    }
    value() {
        return (options, verifier) => this.getPassportOtpStrategyVerifier(options, verifier);
    }
    getPassportOtpStrategyVerifier(options, verifierPassed) {
        const verifyFn = verifierPassed !== null && verifierPassed !== void 0 ? verifierPassed : this.verifierOtp;
        return new otp_auth_1.Otp.Strategy(options, 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (key, otp, cb) => {
            try {
                const user = await verifyFn(key, otp);
                if (!user) {
                    throw new rest_1.HttpErrors.Unauthorized("Invalid Credentials" /* InvalidCredentials */);
                }
                cb(null, user);
            }
            catch (err) {
                cb(err);
            }
        });
    }
};
PassportOtpStrategyFactoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.Strategies.Passport.OTP_VERIFIER)),
    tslib_1.__metadata("design:paramtypes", [Function])
], PassportOtpStrategyFactoryProvider);
exports.PassportOtpStrategyFactoryProvider = PassportOtpStrategyFactoryProvider;
//# sourceMappingURL=otp-strategy-factory.provider.js.map