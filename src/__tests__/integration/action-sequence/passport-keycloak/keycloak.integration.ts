import {Client, createClientForHandler} from '@loopback/testlab';
import {RestServer, Request} from '@loopback/rest';
import {Application, Constructor, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticate} from '../../../../decorators';
import {STRATEGY} from '../../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationSequence} from '../../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../../strategies/keys';
import {Keycloak, VerifyFunction} from '../../../../strategies';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import {IAuthUser} from '../../../../types';
import {KeycloakStrategyFactoryProvider} from '../../../../strategies/passport/passport-keycloak';
import {ClientPasswordVerifyProvider} from '../../../fixtures/providers/passport-client.provider';
import {ClientPasswordStrategyFactoryProvider} from '../../../../strategies/passport/passport-client-password';

describe('getting keycloak oauth2 strategy with options', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 302 when host and client id is passed and passReqToCallback is set true', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.KEYCLOAK, {
        host: 'localhost',
        realm: 'localhost',
        callbackURL: 'localhost',
        authorizationURL: 'localhost',
        tokenURL: 'localhost',
        userInfoURL: 'localhost',
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
      .bind(Strategies.Passport.KEYCLOAK_VERIFIER)
      .toProvider(KeycloakAuthVerifyProvider);
    app
      .bind(Strategies.Passport.KEYCLOAK_STRATEGY_FACTORY)
      .toProvider(KeycloakStrategyFactoryProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});

class KeycloakAuthVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn>
{
  constructor() {}

  value(): VerifyFunction.KeycloakAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Keycloak.Profile,
      cd: (err?: string | Error, user?: IAuthUser) => void,
      req?: Request,
    ) => {
      return userWithoutReqObj;
    };
  }
}
