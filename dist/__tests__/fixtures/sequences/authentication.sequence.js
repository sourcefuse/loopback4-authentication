"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAuthenticationSequence = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const rest_1 = require("@loopback/rest");
const __1 = require("../../../");
const SequenceActions = rest_1.RestBindings.SequenceActions;
let MyAuthenticationSequence = class MyAuthenticationSequence {
    constructor(findRoute, parseParams, invoke, send, reject, authenticateClientRequest, authenticateRequest) {
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        this.authenticateClientRequest = authenticateClientRequest;
        this.authenticateRequest = authenticateRequest;
    }
    async handle(context) {
        try {
            const { request, response } = context;
            const route = this.findRoute(request);
            const args = await this.parseParams(request, route);
            request.body = args[args.length - 1];
            //call authentication action
            await this.authenticateClientRequest(request);
            await this.authenticateRequest(request);
            // Authentication successful, proceed to invoke controller
            const result = await this.invoke(route, args);
            this.send(response, result);
        }
        catch (error) {
            if (error.code === 'AUTHENTICATION_STRATEGY_NOT_FOUND' ||
                error.code === 'USER_PROFILE_NOT_FOUND') {
                Object.assign(error, { statusCode: 401 /* Unauthorized */ });
            }
            this.reject(context, error);
            return;
        }
    }
};
MyAuthenticationSequence = tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)(SequenceActions.FIND_ROUTE)),
    tslib_1.__param(1, (0, context_1.inject)(SequenceActions.PARSE_PARAMS)),
    tslib_1.__param(2, (0, context_1.inject)(SequenceActions.INVOKE_METHOD)),
    tslib_1.__param(3, (0, context_1.inject)(SequenceActions.SEND)),
    tslib_1.__param(4, (0, context_1.inject)(SequenceActions.REJECT)),
    tslib_1.__param(5, (0, context_1.inject)(__1.AuthenticationBindings.CLIENT_AUTH_ACTION)),
    tslib_1.__param(6, (0, context_1.inject)(__1.AuthenticationBindings.USER_AUTH_ACTION)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function, Function, Function, Function, Function])
], MyAuthenticationSequence);
exports.MyAuthenticationSequence = MyAuthenticationSequence;
//# sourceMappingURL=authentication.sequence.js.map