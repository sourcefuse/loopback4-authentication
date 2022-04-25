"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApp = void 0;
const core_1 = require("@loopback/core");
const component_1 = require("../../../component");
const rest_1 = require("@loopback/rest");
/**
 *Gives an instance of application
 */
function getApp() {
    const app = new core_1.Application();
    app.component(component_1.AuthenticationComponent);
    app.component(rest_1.RestComponent);
    return app;
}
exports.getApp = getApp;
//# sourceMappingURL=helpers.js.map