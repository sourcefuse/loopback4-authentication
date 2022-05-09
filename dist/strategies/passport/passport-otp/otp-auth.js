"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport = tslib_1.__importStar(require("passport"));
var Otp;
(function (Otp) {
    class Strategy extends passport.Strategy {
        constructor(_options, verify) {
            super();
            this.name = 'otp';
            if (verify) {
                this.verify = verify;
            }
        }
        authenticate(req, options) {
            const key = req.body.key || (options === null || options === void 0 ? void 0 : options.key);
            const otp = req.body.otp || (options === null || options === void 0 ? void 0 : options.otp);
            if (!key) {
                this.fail();
                return;
            }
            const verified = (err, user, _info) => {
                if (err) {
                    this.error(err);
                    return;
                }
                if (!user) {
                    this.fail();
                    return;
                }
                this.success(user);
            };
            this.verify(key, otp, verified);
        }
    }
    Otp.Strategy = Strategy;
})(Otp = exports.Otp || (exports.Otp = {}));
//# sourceMappingURL=otp-auth.js.map