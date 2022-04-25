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
const keys_2 = require("../../../keys");
const passport_client_provider_1 = require("../../fixtures/providers/passport-client.provider");
describe('Client-password strategy', () => {
    let app;
    let server;
    beforeEach(givenAServer);
    beforeEach(givenAuthenticatedSequence);
    beforeEach(getAuthVerifier);
    it('should return status 200 when options.passRequestToCallback is set true', async () => {
        let TestController = class TestController {
            constructor(client) {
                this.client = client;
            }
            test(body) {
                return this.client;
            }
        };
        tslib_1.__decorate([
            (0, decorators_1.authenticateClient)("client-password" /* CLIENT_PASSWORD */, { passReqToCallback: true }),
            (0, openapi_v3_1.post)('/test'),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_CLIENT)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        const client = await whenIMakeRequestTo(server)
            .post('/test')
            .send({ client_id: 'some id', client_secret: 'some secret' })
            .expect(200);
        (0, testlab_1.expect)(client.body).to.have.property('clientId');
        (0, testlab_1.expect)(client.body).to.have.property('clientSecret');
        (0, testlab_1.expect)(client.body.clientId).to.equal('some id');
        (0, testlab_1.expect)(client.body.clientSecret).to.equal('some secret');
    });
    it('should return status 200 when options.passRequestToCallback is set false', async () => {
        let TestController = class TestController {
            constructor(client) {
                this.client = client;
            }
            test(body) {
                return this.client;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/test'),
            (0, decorators_1.authenticateClient)("client-password" /* CLIENT_PASSWORD */, { passReqToCallback: false }),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_CLIENT)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        const client = await whenIMakeRequestTo(server)
            .post('/test')
            .send({ client_id: 'some id', client_secret: 'some secret' })
            .expect(200);
        (0, testlab_1.expect)(client.body).to.have.property('clientId');
        (0, testlab_1.expect)(client.body).to.have.property('clientSecret');
        (0, testlab_1.expect)(client.body.clientId).to.equal('some id');
        (0, testlab_1.expect)(client.body.clientSecret).to.equal('some secret');
    });
    it('should return status 401 when options.passRequestToCallback is set true', async () => {
        let TestController = class TestController {
            constructor(client) {
                this.client = client;
            }
            async test(body) {
                return this.client;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/test'),
            (0, decorators_1.authenticateClient)("client-password" /* CLIENT_PASSWORD */, { passReqToCallback: true }),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_CLIENT)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/test')
            .send({ client_id: '', client_secret: 'some secret' })
            .expect(401);
    });
    it('should return status 401 when options.passRequestToCallback is set false', async () => {
        let TestController = class TestController {
            constructor(client) {
                this.client = client;
            }
            async test(body) {
                return this.client;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/test'),
            (0, decorators_1.authenticateClient)("client-password" /* CLIENT_PASSWORD */, { passReqToCallback: false }),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_CLIENT)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/test')
            .send({ client_id: '', client_secret: 'some secret' })
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
            .bind(keys_1.Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
            .toProvider(passport_client_provider_1.ClientPasswordVerifyProvider);
    }
    function givenAuthenticatedSequence() {
        // bind user defined sequence
        server.sequence(authentication_sequence_1.MyAuthenticationSequence);
    }
});
describe('integration test for client-password and no verifier', () => {
    let app;
    let server;
    beforeEach(givenAServer);
    beforeEach(givenAuthenticatedSequence);
    it('should return status 401 as this strategy is not implemented', async () => {
        let TestController = class TestController {
            constructor(client) {
                this.client = client;
            }
            test(body) {
                return this.client;
            }
        };
        tslib_1.__decorate([
            (0, openapi_v3_1.post)('/test'),
            (0, decorators_1.authenticateClient)("client-password" /* CLIENT_PASSWORD */, { passReqToCallback: true }),
            tslib_1.__param(0, (0, openapi_v3_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestController.prototype, "test", null);
        TestController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_2.AuthenticationBindings.CURRENT_CLIENT)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestController);
        app.controller(TestController);
        await whenIMakeRequestTo(server)
            .post('/test')
            .send({ client_id: 'some id', client_secret: 'some secret' })
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
//# sourceMappingURL=client-password-verify.integration.js.map