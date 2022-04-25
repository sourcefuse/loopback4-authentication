"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oauth2ResourceOwnerPassword = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport = tslib_1.__importStar(require("passport"));
var Oauth2ResourceOwnerPassword;
(function (Oauth2ResourceOwnerPassword) {
    class Strategy extends passport.Strategy {
        constructor(options, verify) {
            super();
            if (verify) {
                this.passReqToCallback = options.passReqToCallback;
                this.verify = verify;
            }
            else {
                this.passReqToCallback = false;
                this.verify = options;
            }
            this.name = 'oauth2-resource-owner-password';
        }
        authenticate(req, options) {
            if (!req.body ||
                !req.body['client_id'] ||
                !req.body['username'] ||
                !req.body['password']) {
                this.fail();
                return;
            }
            const clientId = req.body['client_id'];
            const clientSecret = req.body['client_secret'];
            const username = req.body['username'];
            const password = req.body['password'];
            const verified = (err, client, user) => {
                if (err) {
                    this.error(err);
                    return;
                }
                if (!client) {
                    this.fail();
                    return;
                }
                if (!user) {
                    this.fail();
                    return;
                }
                this.success(user);
            };
            if (this.passReqToCallback) {
                this.verify(req, clientId, clientSecret, username, password, verified);
            }
            else {
                this.verify(clientId, clientSecret, username, password, verified);
            }
        }
    }
    Oauth2ResourceOwnerPassword.Strategy = Strategy;
})(Oauth2ResourceOwnerPassword = exports.Oauth2ResourceOwnerPassword || (exports.Oauth2ResourceOwnerPassword = {}));
//# sourceMappingURL=oauth2-resource-owner-password-grant.js.map