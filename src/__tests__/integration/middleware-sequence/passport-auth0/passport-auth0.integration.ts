import {Application, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {Request, RestServer} from '@loopback/rest';
import {Client, createClientForHandler} from '@loopback/testlab';
import Auth0Strategy from 'passport-auth0';
import {authenticate} from '../../../../decorators';
import {VerifyFunction} from '../../../../strategies';
import {Strategies} from '../../../../strategies/keys';
import {Auth0StrategyFactoryProvider} from '../../../../strategies/passport/passport-auth0';
import {Auth0} from '../../../../strategies/types/auth0.types';
import {STRATEGY} from '../../../../strategy-name.enum';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';

import {MyAuthenticationMiddlewareSequence} from '../../../fixtures/sequences/authentication-middleware.sequence';
import {getApp} from '../helpers/helpers';

describe('getting auth0 strategy with options using Middleware Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);
  afterEach(closeServer);

  it('should return 302 when client id is passed and passReqToCallback is set true', async () => {
    getAuthVerifier();
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.AUTH0, {
        clientID: 'string',
        clientSecret: 'string',
        callbackURL: 'string',
        domain: 'string',
        passReqToCallback: true,
        state: false,
      })
      test() {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server).get('/test').expect(302);
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
      .bind(Strategies.Passport.AUTH0_STRATEGY_FACTORY)
      .toProvider(Auth0StrategyFactoryProvider);
    app
      .bind(Strategies.Passport.AUTH0_VERIFIER)
      .toProvider(Auth0VerifyProvider);
  }

  function closeServer() {
    app.close();
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationMiddlewareSequence);
  }
});

class Auth0VerifyProvider implements Provider<VerifyFunction.Auth0Fn> {
  constructor() {}

  value(): VerifyFunction.Auth0Fn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Auth0Strategy.Profile,
      cd: Auth0.VerifyCallback,
      req?: Request,
    ) => {
      return userWithoutReqObj;
    };
  }
}
