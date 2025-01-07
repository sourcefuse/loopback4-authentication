import {Application, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {Request, RestServer} from '@loopback/rest';
import {Client, createClientForHandler} from '@loopback/testlab';
import * as GoogleStrategy from 'passport-google-oauth20';
import {authenticate} from '../../../../decorators';
import {VerifyFunction} from '../../../../strategies';
import {Strategies} from '../../../../strategies/keys';
import {GoogleAuthStrategyFactoryProvider} from '../../../../strategies/passport/passport-google-oauth2';
import {STRATEGY} from '../../../../strategy-name.enum';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import {CustomSequence} from '../../../fixtures/sequences/custom-middleware.sequence';
import {getApp, givenCustomMiddlewareServer} from '../helpers/helpers';

describe('getting google oauth2 strategy using Custom Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenCustomSequence);
  beforeEach(getAuthVerifier);

  it('should return 302 when client id is passed and passReqToCallback is set true', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.GOOGLE_OAUTH2, {
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
    server = await givenCustomMiddlewareServer(app);
  }

  function getAuthVerifier() {
    app
      .bind(Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY)
      .toProvider(GoogleAuthStrategyFactoryProvider);
    app
      .bind(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER)
      .toProvider(GoogleAuthVerifyProvider);
  }

  function givenCustomSequence() {
    // bind custom sequence
    server.sequence(CustomSequence);
  }
});

class GoogleAuthVerifyProvider
  implements Provider<VerifyFunction.GoogleAuthFn>
{
  constructor() {}

  value(): VerifyFunction.GoogleAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
      cd: GoogleStrategy.VerifyCallback,
      req?: Request,
    ) => {
      return userWithoutReqObj;
    };
  }
}
