"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientAuthenticateMetadata = exports.authenticateClient = void 0;
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
function authenticateClient(strategyName, options) {
    return context_1.MethodDecoratorFactory.createDecorator(keys_1.CLIENT_AUTHENTICATION_METADATA_KEY, {
        strategy: strategyName,
        options: options !== null && options !== void 0 ? options : {},
    });
}
exports.authenticateClient = authenticateClient;
function getClientAuthenticateMetadata(controllerClass, methodName) {
    return context_1.MetadataInspector.getMethodMetadata(keys_1.CLIENT_AUTHENTICATION_METADATA_KEY, controllerClass.prototype, methodName);
}
exports.getClientAuthenticateMetadata = getClientAuthenticateMetadata;
//# sourceMappingURL=authenticate-client.decorator.js.map