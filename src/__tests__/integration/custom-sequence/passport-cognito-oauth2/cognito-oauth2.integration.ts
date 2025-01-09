import {Application, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {Request, RestServer} from '@loopback/rest';
import {Client, createClientForHandler} from '@loopback/testlab';
import {authenticate} from '../../../../decorators';
import {VerifyFunction} from '../../../../strategies';
import {Strategies} from '../../../../strategies/keys';
import {CognitoStrategyFactoryProvider} from '../../../../strategies/passport/passport-cognito-oauth2';
import {STRATEGY} from '../../../../strategy-name.enum';
import {Cognito} from '../../../../types';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import {CustomSequence} from '../../../fixtures/sequences/custom-middleware.sequence';
import {getApp, givenCustomMiddlewareServer} from '../helpers/helpers';

describe('getting cognito oauth2 strategy using Custom Sequence', () => {
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
    server = await givenCustomMiddlewareServer(app);
  }

  function getAuthVerifier() {
    app
      .bind(Strategies.Passport.COGNITO_OAUTH2_VERIFIER)
      .toProvider(CognitoAuthVerifyProvider);
    app
      .bind(Strategies.Passport.COGNITO_OAUTH2_STRATEGY_FACTORY)
      .toProvider(CognitoStrategyFactoryProvider);
  }

  function givenAuthenticatedSequence() {
    // bind custom sequence
    server.sequence(CustomSequence);
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
