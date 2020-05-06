import {Client, createClientForHandler, expect} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {Application, inject} from '@loopback/core';
import {post, requestBody} from '@loopback/openapi-v3';
import {authenticate} from '../../../decorators';
import {STRATEGY} from '../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationSequence} from '../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../strategies/keys';
import {ResourceOwnerVerifyProvider} from '../../fixtures/providers/resource-owner.provider';
import {AuthenticationBindings} from '../../../keys';
import {IAuthUser} from '../../../types';

describe('Resource-owner-password strategy', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 422 bad request when no user data is sent', async () => {
    class TestController {
      @post('/auth/resource-owner-pass')
      @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT)
      test(@requestBody() body: {username: string; password: string}) {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/auth/resource-owner-pass')
      .send({})
      .expect(401);
  });

  it('should return status 200 for no options', async () => {
    class TestController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @post('/auth/resource-owner-pass/no-options')
      @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT)
      test(
        @requestBody()
        body: {
          username: string;
          password: string;
          client_id: string;
          client_secret: string;
        },
      ) {
        return this.user;
      }
    }

    app.controller(TestController);

    const res = await whenIMakeRequestTo(server)
      .post('/auth/resource-owner-pass/no-options')
      .send({
        username: 'username',
        password: 'password',
        client_id: 'client id', // eslint-disable-line
        client_secret: 'client secret', // eslint-disable-line
      })
      .expect(200);

    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal('username');
    expect(res.body).to.have.property('password');
    expect(res.body.password).to.equal('password');
  });

  it('should return the user credentials are sent via body and options are passed with passRequestCallback true', async () => {
    class TestController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @post('/auth/resource-owner/passReqToCallback')
      @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT, {
        passReqToCallback: true,
      })
      async test(
        @requestBody()
        body: {
          username: string;
          password: string;
          client_id: string;
          client_secret: string;
        },
      ) {
        return this.user;
      }
    }

    app.controller(TestController);

    const res = await whenIMakeRequestTo(server)
      .post('/auth/resource-owner/passReqToCallback')
      .send({
        username: 'user name',
        password: 'password',
        client_id: 'client id', // eslint-disable-line
        client_secret: 'client secret', // eslint-disable-line
      })
      .expect(200);

    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal('user name');
    expect(res.body).to.have.property('password');
    expect(res.body.password).to.equal('password');
  });

  it('should return the user which was passed via body and options are passed with passRequestCallback false', async () => {
    class TestController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @post('/auth/resource-owner/passReqToCallback-false')
      @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT, {
        passReqToCallback: false,
      })
      async test(
        @requestBody()
        body: {
          username: string;
          password: string;
          client_id: string;
          client_secret: string;
        },
      ) {
        return this.user;
      }
    }

    app.controller(TestController);

    const res = await whenIMakeRequestTo(server)
      .post('/auth/resource-owner/passReqToCallback-false')
      .send({
        username: 'name',
        password: 'password',
        client_id: 'client id', // eslint-disable-line
        client_secret: 'client secret', // eslint-disable-line
      })
      .expect(200);

    expect(res.body).to.have.property('username');
    expect(res.body.username).to.equal('name');
    expect(res.body).to.have.property('password');
    expect(res.body.password).to.equal('password');
  });

  it('should return the user passed via verifier when no options are passed', async () => {
    class TestController {
      @post('/test')
      @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT)
      async test(
        @requestBody()
        body: {
          username: string;
          password: string;
          client_id: string;
          client_secret: string;
        },
      ) {
        return body;
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/test')
      .send({
        username: '',
        password: 'password',
        client_id: '', // eslint-disable-line
        client_secret: 'client secret', // eslint-disable-line
      })
      .expect(401);
  });

  function whenIMakeRequestTo(restServer: RestServer): Client {
    return createClientForHandler(restServer.requestHandler);
  }

  async function givenAServer() {
    app = getApp();
    server = await app.getServer(RestServer);
  }

  function getAuthVerifier() {
    app
      .bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
      .toProvider(ResourceOwnerVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});

describe('Resource-owner strategy with no verifier', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);

  it('should return the user passed via verifier and options are passed with passRequestCallback false', async () => {
    class TestController {
      options = {
        passRequestToCallback: false,
      };

      @post('/test')
      @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT)
      async test(
        @requestBody()
        body: {
          username: string;
          password: string;
          client_id: string;
          client_secret: string;
        },
      ) {
        return body;
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/test')
      .send({
        username: 'username',
        password: 'password',
        client_id: 'client id', // eslint-disable-line
        client_secret: 'client secret', // eslint-disable-line
      })
      .expect(401);
  });

  function whenIMakeRequestTo(restServer: RestServer): Client {
    return createClientForHandler(restServer.requestHandler);
  }

  async function givenAServer() {
    app = getApp();
    server = await app.getServer(RestServer);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});
