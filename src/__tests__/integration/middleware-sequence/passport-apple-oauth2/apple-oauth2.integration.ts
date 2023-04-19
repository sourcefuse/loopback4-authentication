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
import AppleStrategy, {DecodedIdToken} from 'passport-apple';
import {AppleAuthStrategyFactoryProvider} from '../../../../strategies/passport/passport-apple-oauth2';
import {
  ClientPasswordStrategyFactoryProvider,
  ClientPasswordVerifyProvider,
} from '../../../../strategies/passport/passport-client-password';

describe('getting apple oauth2 strategy with options using Middleware Sequence', () => {
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
      @authenticate(STRATEGY.APPLE_OAUTH2, {
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
    app.bind(Strategies.Passport.APPLE_OAUTH2_STRATEGY_FACTORY).toProvider(
      AppleAuthStrategyFactoryProvider as unknown as Constructor<
        Provider<AppleAuthStrategyFactoryProvider>
      >, //To be Fixed
    );
    app
      .bind(Strategies.Passport.APPLE_OAUTH2_VERIFIER)
      .toProvider(AppleAuthVerifyProvider);
  }

  function closeServer() {
    app.close();
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationMiddlewareSequence);
  }
});

class AppleAuthVerifyProvider implements Provider<VerifyFunction.AppleAuthFn> {
  constructor() {}

  value(): VerifyFunction.AppleAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      decodedIdToken: DecodedIdToken,
      profile: AppleStrategy.Profile,
      cd: AppleStrategy.VerifyCallback,
      req?: Request,
    ) => {
      return userWithoutReqObj;
    };
  }
}
