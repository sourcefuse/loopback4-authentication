import {IAuthUser} from '../../../types';
import {VerifyFunction} from '../../../strategies';
import {Client, createClientForHandler} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {Application, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticate} from '../../../decorators';
import {STRATEGY} from '../../../strategy-name.enum';
import {getApp} from './helpers';
import {MyAuthenticationSequence} from '../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../strategies/keys';

/**
 * Testing overall flow of authentication with bearer strategy
 */
describe('getting strategy with options', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 401 bad request', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.BEARER)
      test() {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .get('/test')
      .expect(401);
  });

  it('should return status 200', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.BEARER)
      test() {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .get('/test')
      .set('Authorization', 'Bearer sometoken')
      .expect(200);
  });

  it('should return status 401 as Bearer is not sent in token', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.BEARER)
      test() {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server)
      .get('/test')
      .set('Authorization', 'sometoken')
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
      .bind(Strategies.Passport.BEARER_TOKEN_VERIFIER)
      .toProvider(BearerTokenVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});

class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value() {
    return async (token: string) => {
      const userToPass: IAuthUser = {
        id: 1,
        username: 'xyz',
        password: 'pass',
      };

      return userToPass;
    };
  }
}
