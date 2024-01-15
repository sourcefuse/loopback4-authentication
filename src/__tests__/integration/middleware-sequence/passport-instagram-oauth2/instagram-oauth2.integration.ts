import {Application, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {Request, RestServer} from '@loopback/rest';
import {Client, createClientForHandler} from '@loopback/testlab';
import * as InstagramStrategy from 'passport-instagram';
import {authenticate} from '../../../../decorators';
import {VerifyCallback, VerifyFunction} from '../../../../strategies';
import {Strategies} from '../../../../strategies/keys';
import {InstagramAuthStrategyFactoryProvider} from '../../../../strategies/passport/passport-insta-oauth2';
import {STRATEGY} from '../../../../strategy-name.enum';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import {MyAuthenticationMiddlewareSequence} from '../../../fixtures/sequences/authentication-middleware.sequence';
import {getApp} from '../helpers/helpers';

describe('getting instagram oauth2 strategy with options using Middleware Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 302 when client id is passed and passReqToCallback is set true', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.INSTAGRAM_OAUTH2, {
        clientID: 'string',
        clientSecret: 'string',
        passReqToCallback: true,
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
      .bind(Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY)
      .toProvider(InstagramAuthStrategyFactoryProvider);
    app
      .bind(Strategies.Passport.INSTAGRAM_OAUTH2_VERIFIER)
      .toProvider(InstagramAuthVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationMiddlewareSequence);
  }
});

class InstagramAuthVerifyProvider
  implements Provider<VerifyFunction.InstagramAuthFn>
{
  constructor() {}

  value(): VerifyFunction.InstagramAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: InstagramStrategy.Profile,
      cd: VerifyCallback,
      req?: Request,
    ) => {
      return userWithoutReqObj;
    };
  }
}
