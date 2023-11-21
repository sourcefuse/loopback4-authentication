import {Client, createClientForHandler} from '@loopback/testlab';
import {RestServer, Request} from '@loopback/rest';
import {Application, Constructor, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticate} from '../../../../decorators';
import {STRATEGY} from '../../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationMiddlewareSequence} from '../../../fixtures/sequences/authentication-middleware.sequence';
import {Strategies} from '../../../../strategies/keys';
import {VerifyFunction} from '../../../../strategies';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import * as GoogleStrategy from 'passport-google-oauth20';
import {GoogleAuthStrategyFactoryProvider} from '../../../../strategies/passport/passport-google-oauth2';
import {ClientPasswordVerifyProvider} from '../../../fixtures/providers/passport-client.provider';
import {ClientPasswordStrategyFactoryProvider} from '../../../../strategies/passport/passport-client-password';

describe('getting google oauth2 strategy with options using Middleware Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
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
    server = await app.getServer(RestServer);
  }

  function getAuthVerifier() {
    app
      .bind(Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY)
      .toProvider(GoogleAuthStrategyFactoryProvider);
    app
      .bind(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER)
      .toProvider(GoogleAuthVerifyProvider);
    app
      .bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
      .toProvider(ClientPasswordVerifyProvider);
    app
      .bind(Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY)
      .toProvider(ClientPasswordStrategyFactoryProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationMiddlewareSequence);
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
