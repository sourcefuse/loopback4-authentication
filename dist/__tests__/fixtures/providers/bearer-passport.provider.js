"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerTokenVerifyProvider = void 0;
const bearer_data_1 = require("../data/bearer-data");
class BearerTokenVerifyProvider {
    constructor() { }
    value() {
        return async (token, req) => {
            if (token !== bearer_data_1.validToken) {
                return null;
            }
            if (req) {
                return bearer_data_1.userWhenReqObj;
            }
            return bearer_data_1.userWithoutReqObj;
        };
    }
}
exports.BearerTokenVerifyProvider = BearerTokenVerifyProvider;
//# sourceMappingURL=bearer-passport.provider.js.map