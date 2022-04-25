"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const rest_1 = require("@loopback/rest");
const core_1 = require("@loopback/core");
const openapi_v3_1 = require("@loopback/openapi-v3");
const decorators_1 = require("../../../decorators");
const helpers_1 = require("../helpers/helpers");
const authentication_sequence_1 = require("../../fixtures/sequences/authentication.sequence");
const keys_1 = require("../../../strategies/keys");
const local_password_provider_1 = require("../../fixtures/providers/local-password.provider");
const keys_2 = require("../../../keys");
const models_1 = require("../../../models");
/**
 * Testing overall flow of authentication with bearer strategy
 */
describe('Local passport strategy', () => {
    let app;
    let server;
    beforeEach(givenAServer);
    beforeEach(givenAuthenticatedSequence);
    beforeEach(getAuthVerifier);
    it('should return 400 bad request when no user data is passed', async () => {
        class TestController {
            test(body) {
                return 'test successful';
            }
        }
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/local/no-user-data-passed'),
            (0, decorators_1.authenticate)("local" /* LOCAL */),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)({ required: true })),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [models_1.Authuser]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestController.prototype, "test", null);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/auth/local/no-user-data-passed')
            .expect(400);
    });
    it('should return 422 bad request when invalid user data is passed', async () => {
        class TestController {
            test(body) {
                return 'test successful';
            }
        }
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/local/no-user-data-passed'),
            (0, decorators_1.authenticate)("local" /* LOCAL */),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [models_1.Authuser]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestController.prototype, "test", null);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/auth/local/no-user-data-passed')
            .send({})
            .expect(422);
    });
    it('should return status 200 for no options', async () => {
        let TestController = class TestController {
            constructor(user) {
                this.user = user;
            }
            test(body) {
                return this.user;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/local/no-options'),
            (0, decorators_1.authenticate)("local" /* LOCAL */),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_USER)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        const user = await whenIMakeRequestTo(server)
            .post('/auth/local/no-options')
            .send({ username: 'user name', password: 'password' })
            .expect(200);
        (0, testlab_1.expect)(user.body).to.have.property('username');
        (0, testlab_1.expect)(user.body.username).to.equal('user name');
        (0, testlab_1.expect)(user.body).to.have.property('password');
        (0, testlab_1.expect)(user.body.password).to.equal('password');
    });
    it('should return the user credentials are sent via body and options are passed with passRequestCallback true', async () => {
        let TestController = class TestController {
            constructor(user) {
                this.user = user;
            }
            async test(body) {
                return this.user;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/local/pass-req-callback-true'),
            (0, decorators_1.authenticate)("local" /* LOCAL */, { passReqToCallback: true }),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_USER)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        const user = await whenIMakeRequestTo(server)
            .post('/auth/local/pass-req-callback-true')
            .send({ username: 'name', password: 'password' })
            .expect(200);
        (0, testlab_1.expect)(user.body).to.have.property('username');
        (0, testlab_1.expect)(user.body.username).to.equal('name');
        (0, testlab_1.expect)(user.body).to.have.property('password');
        (0, testlab_1.expect)(user.body.password).to.equal('password');
    });
    it('should return the user which was passed via body and options are passed with passRequestCallback false', async () => {
        let TestController = class TestController {
            constructor(user) {
                this.user = user;
            }
            async test(body) {
                return this.user;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/local/pass-req-callback-false'),
            (0, decorators_1.authenticate)("local" /* LOCAL */, { passReqToCallback: false }),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_USER)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/auth/local/pass-req-callback-false')
            .send({ username: 'username', password: 'password' })
            .expect(200);
    });
    it('should return 401 when provider returns null', async () => {
        let TestController = class TestController {
            constructor(user) {
                this.user = user;
            }
            async test(body) {
                return body;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/local/null-user'),
            (0, decorators_1.authenticate)("local" /* LOCAL */),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_USER)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/auth/local/null-user')
            .send({ username: '', password: 'password' })
            .expect(401);
    });
    function whenIMakeRequestTo(restServer) {
        return (0, testlab_1.createClientForHandler)(restServer.requestHandler);
    }
    async function givenAServer() {
        app = (0, helpers_1.getApp)();
        server = await app.getServer(rest_1.RestServer);
    }
    function getAuthVerifier() {
        app
            .bind(keys_1.Strategies.Passport.LOCAL_PASSWORD_VERIFIER)
            .toProvider(local_password_provider_1.LocalVerifyProvider);
    }
    function givenAuthenticatedSequence() {
        // bind user defined sequence
        server.sequence(authentication_sequence_1.MyAuthenticationSequence);
    }
});
describe('Local strategy with no verifier', () => {
    let app;
    let server;
    beforeEach(givenAServer);
    beforeEach(givenAuthenticatedSequence);
    it('should return 401 when option passRequestCallback is false', async () => {
        class TestController {
            constructor() {
                this.options = {
                    passRequestToCallback: false,
                };
            }
            async test(body) {
                return body;
            }
        }
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/local/no-verifier'),
            (0, decorators_1.authenticate)("local" /* LOCAL */, { passReqToCallback: false }),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/auth/local/no-verifier')
            .send({ username: 'username', password: 'password' })
            .expect(401);
    });
    function whenIMakeRequestTo(restServer) {
        return (0, testlab_1.createClientForHandler)(restServer.requestHandler);
    }
    async function givenAServer() {
        app = (0, helpers_1.getApp)();
        server = await app.getServer(rest_1.RestServer);
    }
    function givenAuthenticatedSequence() {
        // bind user defined sequence
        server.sequence(authentication_sequence_1.MyAuthenticationSequence);
    }
});
//# sourceMappingURL=local-passport.integration.js.map