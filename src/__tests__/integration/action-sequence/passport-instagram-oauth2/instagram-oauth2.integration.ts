import {Client, createClientForHandler} from '@loopback/testlab';
import {RestServer, Request} from '@loopback/rest';
import {Application, Constructor, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticate} from '../../../../decorators';
import {STRATEGY} from '../../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationSequence} from '../../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../../strategies/keys';
import {VerifyCallback, VerifyFunction} from '../../../../strategies';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import * as InstagramStrategy from 'passport-instagram';
import {InstagramAuthStrategyFactoryProvider} from '../../../../strategies/passport/passport-insta-oauth2';
import {ClientPasswordVerifyProvider} from '../../../fixtures/providers/passport-client.provider';
import {ClientPasswordStrategyFactoryProvider} from '../../../../strategies/passport/passport-client-password';

describe('getting instagram oauth2 strategy with options', () => {
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
      .bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
      .toProvider(ClientPasswordVerifyProvider);
    app
      .bind(Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY)
      .toProvider(ClientPasswordStrategyFactoryProvider);
    app.bind(Strategies.Passport.INSTAGRAM_OAUTH2_STRATEGY_FACTORY).toProvider(
      InstagramAuthStrategyFactoryProvider as unknown as Constructor<
        Provider<InstagramAuthStrategyFactoryProvider>
      >, //To be fixed
    );
    app
      .bind(Strategies.Passport.INSTAGRAM_OAUTH2_VERIFIER)
      .toProvider(InstagramAuthVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
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
