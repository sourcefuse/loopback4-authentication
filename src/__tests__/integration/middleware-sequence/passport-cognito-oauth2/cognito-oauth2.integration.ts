import {Client, createClientForHandler} from '@loopback/testlab';
import {RestServer, Request} from '@loopback/rest';
import {Application, Constructor, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticate} from '../../../../decorators';
import {STRATEGY} from '../../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {Strategies} from '../../../../strategies/keys';
import {VerifyFunction} from '../../../../strategies';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import {Cognito} from '../../../../types';
import {MyAuthenticationMiddlewareSequence} from '../../../fixtures/sequences/authentication-middleware.sequence';
import {CognitoStrategyFactoryProvider} from '../../../../strategies/passport/passport-cognito-oauth2';
import {ClientPasswordVerifyProvider} from '../../../fixtures/providers/passport-client.provider';
import {ClientPasswordStrategyFactoryProvider} from '../../../../strategies/passport/passport-client-password';

describe('getting cognito oauth2 strategy with options using Middleware Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 302 when client id is passed and passReqToCallback is set true', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.COGNITO_OAUTH2, {
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
    app
      .bind(Strategies.Passport.COGNITO_OAUTH2_VERIFIER)
      .toProvider(CognitoAuthVerifyProvider);
    app.bind(Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY).toProvider(
      CognitoStrategyFactoryProvider as unknown as Constructor<
        Provider<CognitoStrategyFactoryProvider>
      >, //To be Fixed
    );
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationMiddlewareSequence);
  }
});

class CognitoAuthVerifyProvider
  implements Provider<VerifyFunction.CognitoAuthFn>
{
  constructor() {}

  value(): VerifyFunction.CognitoAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Cognito.Profile,
      cd: Cognito.VerifyCallback,
      req?: Request,
    ) => {
      return userWithoutReqObj;
    };
  }
}
