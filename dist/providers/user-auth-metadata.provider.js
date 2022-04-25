"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMetadataProvider = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const core_1 = require("@loopback/core");
const decorators_1 = require("../decorators");
let AuthMetadataProvider = class AuthMetadataProvider {
    constructor(controllerClass, methodName) {
        this.controllerClass = controllerClass;
        this.methodName = methodName;
    }
    value() {
        if (!this.controllerClass || !this.methodName)
            return;
        return (0, decorators_1.getAuthenticateMetadata)(this.controllerClass, this.methodName);
    }
};
AuthMetadataProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)(core_1.CoreBindings.CONTROLLER_CLASS, { optional: true })),
    tslib_1.__param(1, (0, context_1.inject)(core_1.CoreBindings.CONTROLLER_METHOD_NAME, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object, String])
], AuthMetadataProvider);
exports.AuthMetadataProvider = AuthMetadataProvider;
//# sourceMappingURL=user-auth-metadata.provider.js.map