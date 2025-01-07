import {Application, inject} from '@loopback/core';
import {post, requestBody} from '@loopback/openapi-v3';
import {RestServer} from '@loopback/rest';
import {Client, createClientForHandler, expect} from '@loopback/testlab';
import {authenticate} from '../../../../decorators';
import {AuthenticationBindings} from '../../../../keys';
import {Strategies} from '../../../../strategies/keys';
import {LocalPasswordStrategyFactoryProvider} from '../../../../strategies/passport/passport-local';
import {STRATEGY} from '../../../../strategy-name.enum';
import {IAuthUser} from '../../../../types';
import {LocalVerifyProvider} from '../../../fixtures/providers/local-password.provider';
import {CustomSequence} from '../../../fixtures/sequences/custom-middleware.sequence';
import {UserCred} from '../../../fixtures/user-cred.model';
import {getApp, givenCustomMiddlewareServer} from '../helpers/helpers';
/**
 * Testing overall flow of authentication with bearer strategy
 */
describe('Local passport strategy using Custom Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenCustomSequence);
  beforeEach(getAuthVerifier);

  it('should return 400 bad request when no user data is passed', async () => {
    class TestController {
      @post('/auth/local/no-user-data-passed')
      @authenticate(STRATEGY.LOCAL)
      test(
        @requestBody({required: true})
        body: UserCred,
      ) {
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
        body: UserCred,
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
      test(@requestBody() body: UserCred) {
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
      async test(@requestBody() body: UserCred) {
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
      async test(@requestBody() body: UserCred) {
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
      async test(@requestBody() body: UserCred) {
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
    server = await givenCustomMiddlewareServer(app);
  }

  function getAuthVerifier() {
    app
      .bind(Strategies.Passport.LOCAL_STRATEGY_FACTORY)
      .toProvider(LocalPasswordStrategyFactoryProvider);
    app
      .bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER)
      .toProvider(LocalVerifyProvider);
  }

  function givenCustomSequence() {
    // bind using custom sequence
    server.sequence(CustomSequence);
  }
});
