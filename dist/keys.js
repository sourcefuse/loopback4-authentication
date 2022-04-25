"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_AUTHENTICATION_METADATA_KEY = exports.USER_AUTHENTICATION_METADATA_KEY = exports.AuthenticationBindings = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const metadata_1 = require("@loopback/metadata");
tslib_1.__exportStar(require("./strategies/keys"), exports);
/**
 * Binding keys used by this component.
 */
var AuthenticationBindings;
(function (AuthenticationBindings) {
    AuthenticationBindings.USER_STRATEGY = context_1.BindingKey.create('sf.userAuthentication.strategy');
    AuthenticationBindings.CLIENT_STRATEGY = context_1.BindingKey.create('sf.clientAuthentication.strategy');
    AuthenticationBindings.USER_AUTH_ACTION = context_1.BindingKey.create('sf.userAuthentication.actions.authenticate');
    AuthenticationBindings.CLIENT_AUTH_ACTION = context_1.BindingKey.create('sf.clientAuthentication.actions.authenticate');
    AuthenticationBindings.USER_METADATA = context_1.BindingKey.create('sf.userAuthentication.operationMetadata');
    AuthenticationBindings.CLIENT_METADATA = context_1.BindingKey.create('sf.clientAuthentication.operationMetadata');
    AuthenticationBindings.CURRENT_USER = context_1.BindingKey.create('sf.userAuthentication.currentUser');
    AuthenticationBindings.CURRENT_CLIENT = context_1.BindingKey.create('sf.clientAuthentication.currentClient');
})(AuthenticationBindings = exports.AuthenticationBindings || (exports.AuthenticationBindings = {}));
exports.USER_AUTHENTICATION_METADATA_KEY = metadata_1.MetadataAccessor.create('userAuthentication.operationsMetadata');
exports.CLIENT_AUTHENTICATION_METADATA_KEY = metadata_1.MetadataAccessor.create('clientAuthentication.operationsMetadata');
//# sourceMappingURL=keys.js.map