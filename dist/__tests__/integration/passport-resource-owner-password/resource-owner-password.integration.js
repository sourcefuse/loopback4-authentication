"use strict";
/* eslint-disable  @typescript-eslint/naming-convention */
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
const resource_owner_provider_1 = require("../../fixtures/providers/resource-owner.provider");
const keys_2 = require("../../../keys");
describe('Resource-owner-password strategy', () => {
    let app;
    let server;
    beforeEach(givenAServer);
    beforeEach(givenAuthenticatedSequence);
    beforeEach(getAuthVerifier);
    it('should return 422 bad request when no user data is sent', async () => {
        class TestController {
            test(body) {
                return 'test successful';
            }
        }
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/auth/resource-owner-pass'),
            (0, decorators_1.authenticate)("OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestController.prototype, "test", null);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/auth/resource-owner-pass')
            .send({})
            .expect(401);
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
            (0, openapi_v3_1.post)('/auth/resource-owner-pass/no-options'),
            (0, decorators_1.authenticate)("OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */),
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
        const res = await whenIMakeRequestTo(server)
            .post('/auth/resource-owner-pass/no-options')
            .send({
            username: 'username',
            password: 'password',
            client_id: 'client id',
            client_secret: 'client secret',
        })
            .expect(200);
        (0, testlab_1.expect)(res.body).to.have.property('username');
        (0, testlab_1.expect)(res.body.username).to.equal('username');
        (0, testlab_1.expect)(res.body).to.have.property('password');
        (0, testlab_1.expect)(res.body.password).to.equal('password');
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
            (0, openapi_v3_1.post)('/auth/resource-owner/passReqToCallback'),
            (0, decorators_1.authenticate)("OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */, {
                passReqToCallback: true,
            }),
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
        const res = await whenIMakeRequestTo(server)
            .post('/auth/resource-owner/passReqToCallback')
            .send({
            username: 'user name',
            password: 'password',
            client_id: 'client id',
            client_secret: 'client secret',
        })
            .expect(200);
        (0, testlab_1.expect)(res.body).to.have.property('username');
        (0, testlab_1.expect)(res.body.username).to.equal('user name');
        (0, testlab_1.expect)(res.body).to.have.property('password');
        (0, testlab_1.expect)(res.body.password).to.equal('password');
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
            (0, openapi_v3_1.post)('/auth/resource-owner/passReqToCallback-false'),
            (0, decorators_1.authenticate)("OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */, {
                passReqToCallback: false,
            }),
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
        const res = await whenIMakeRequestTo(server)
            .post('/auth/resource-owner/passReqToCallback-false')
            .send({
            username: 'name',
            password: 'password',
            client_id: 'client id',
            client_secret: 'client secret',
        })
            .expect(200);
        (0, testlab_1.expect)(res.body).to.have.property('username');
        (0, testlab_1.expect)(res.body.username).to.equal('name');
        (0, testlab_1.expect)(res.body).to.have.property('password');
        (0, testlab_1.expect)(res.body.password).to.equal('password');
    });
    it('should return the user passed via verifier when no options are passed', async () => {
        class TestController {
            async test(body) {
                return body;
            }
        }
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/test'),
            (0, decorators_1.authenticate)("OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/test')
            .send({
            username: '',
            password: 'password',
            client_id: '',
            client_secret: 'client secret',
        })
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
            .bind(keys_1.Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
            .toProvider(resource_owner_provider_1.ResourceOwnerVerifyProvider);
    }
    function givenAuthenticatedSequence() {
        // bind user defined sequence
        server.sequence(authentication_sequence_1.MyAuthenticationSequence);
    }
});
describe('Resource-owner strategy with no verifier', () => {
    let app;
    let server;
    beforeEach(givenAServer);
    beforeEach(givenAuthenticatedSequence);
    it('should return the user passed via verifier and options are passed with passRequestCallback false', async () => {
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
            (0, openapi_v3_1.post)('/test'),
            (0, decorators_1.authenticate)("OAuth2 resource owner grant" /* OAUTH2_RESOURCE_OWNER_GRANT */),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/test')
            .send({
            username: 'username',
            password: 'password',
            client_id: 'client id',
            client_secret: 'client secret',
        })
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
//# sourceMappingURL=resource-owner-password.integration.js.map