"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyAdapter = void 0;
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const rest_1 = require("@loopback/rest");
const passportRequestMixin = require('passport/lib/http/request');
/**
 * Adapter class to invoke passport-strategy
 *   1. provides express dependencies to the passport strategies
 *   2. provides shimming of requests for passport authentication
 *   3. provides lifecycle similar to express to the passport-strategy
 *   3. provides state methods to the strategy instance
 * see: https://github.com/jaredhanson/passport
 */
class StrategyAdapter {
    /**
     * @param strategy instance of a class which implements a passport-strategy;
     * @description http://passportjs.org/
     */
    constructor(strategy) {
        this.strategy = strategy;
    }
    /**
     * The function to invoke the contained passport strategy.
     *     1. Create an instance of the strategy
     *     2. add success and failure state handlers
     *     3. authenticate using the strategy
     * @param request The incoming request.
     */
    authenticate(request, response, options) {
        return new Promise((resolve, reject) => {
            // mix-in passport additions like req.logIn and req.logOut
            for (const key in passportRequestMixin) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                request[key] = passportRequestMixin[key];
            }
            // create a prototype chain of an instance of a passport strategy
            const strategy = Object.create(this.strategy);
            // add success state handler to strategy instance
            strategy.success = (t) => {
                resolve(t);
            };
            // add failure state handler to strategy instance
            strategy.fail = (challenge) => {
                reject(new rest_1.HttpErrors.Unauthorized(challenge));
            };
            // add error state handler to strategy instance
            strategy.error = (error) => {
                reject(new rest_1.HttpErrors.Unauthorized(error));
            };
            strategy.redirect = (url) => {
                if (response) {
                    response.redirect(url, 302);
                }
                resolve();
            };
            // authenticate
            strategy.authenticate(request, options);
        });
    }
}
exports.StrategyAdapter = StrategyAdapter;
//# sourceMappingURL=strategy-adapter.js.map