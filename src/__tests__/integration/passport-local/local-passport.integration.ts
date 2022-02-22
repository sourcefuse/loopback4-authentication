import {Client, createClientForHandler, expect} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {Application, inject} from '@loopback/core';
import {post, requestBody} from '@loopback/openapi-v3';
import {authenticate} from '../../../decorators';
import {STRATEGY} from '../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationSequence} from '../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../strategies/keys';
import {LocalVerifyProvider} from '../../fixtures/providers/local-password.provider';
import {AuthenticationBindings} from '../../../keys';
import {IAuthUser} from '../../../types';
import {Authuser} from '../../../models';
/**
 * Testing overall flow of authentication with bearer strategy
 */
describe('Local passport strategy', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 400 bad request when no user data is passed', async () => {
    class TestController {
      @post('/auth/local/no-user-data-passed')
      @authenticate(STRATEGY.LOCAL)
      test(@requestBody({required: true}) body: Authuser) {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/auth/local/no-user-data-passed')
      .expect(400);
  });

  it('should return 422 bad request when invalid user data is passed', async () => {
    class TestController {
      @post('/auth/local/no-user-data-passed')
      @authenticate(STRATEGY.LOCAL)
      test(
        @requestBody()
        body: Authuser,
      ) {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/auth/local/no-user-data-passed')
      .send({})
      .expect(422);
  });

  it('should return status 200 for no options', async () => {
    class TestController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @post('/auth/local/no-options')
      @authenticate(STRATEGY.LOCAL)
      test(@requestBody() body: {username: string; password: string}) {
        return this.user;
      }
    }

    app.controller(TestController);

    const user = await whenIMakeRequestTo(server)
      .post('/auth/local/no-options')
      .send({username: 'user name', password: 'password'})
      .expect(200);

    expect(user.body).to.have.property('username');
    expect(user.body.username).to.equal('user name');

    expect(user.body).to.have.property('password');
    expect(user.body.password).to.equal('password');
  });

  it('should return the user credentials are sent via body and options are passed with passRequestCallback true', async () => {
    class TestController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @post('/auth/local/pass-req-callback-true')
      @authenticate(STRATEGY.LOCAL, {passReqToCallback: true})
      async test(@requestBody() body: {username: string; password: string}) {
        return this.user;
      }
    }

    app.controller(TestController);

    const user = await whenIMakeRequestTo(server)
      .post('/auth/local/pass-req-callback-true')
      .send({username: 'name', password: 'password'})
      .expect(200);

    expect(user.body).to.have.property('username');
    expect(user.body.username).to.equal('name');

    expect(user.body).to.have.property('password');
    expect(user.body.password).to.equal('password');
  });

  it('should return the user which was passed via body and options are passed with passRequestCallback false', async () => {
    class TestController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @post('/auth/local/pass-req-callback-false')
      @authenticate(STRATEGY.LOCAL, {passReqToCallback: false})
      async test(@requestBody() body: {username: string; password: string}) {
        return this.user;
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/auth/local/pass-req-callback-false')
      .send({username: 'username', password: 'password'})
      .expect(200);
  });

  it('should return 401 when provider returns null', async () => {
    class TestController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @post('/auth/local/null-user')
      @authenticate(STRATEGY.LOCAL)
      async test(@requestBody() body: {username: string; password: string}) {
        return body;
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/auth/local/null-user')
      .send({username: '', password: 'password'})
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
      .bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER)
      .toProvider(LocalVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});

describe('Local strategy with no verifier', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);

  it('should return 401 when option passRequestCallback is false', async () => {
    class TestController {
      options = {
        passRequestToCallback: false,
      };

      @post('/auth/local/no-verifier')
      @authenticate(STRATEGY.LOCAL, {passReqToCallback: false})
      async test(@requestBody() body: {username: string; password: string}) {
        return body;
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .post('/auth/local/no-verifier')
      .send({username: 'username', password: 'password'})
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
