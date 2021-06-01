import {Client, createClientForHandler} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {Application} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticate} from '../../../decorators';
import {STRATEGY} from '../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationSequence} from '../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../strategies/keys';
import {KeyCloakVerifyProvider} from '../../fixtures/providers/keycloak.provider';

describe('getting keycloak strategy with options', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 200 when clientID, clientSecret, host, realm, callbackURL, authorizationURL,tokenURL,userInfoURL are passed and passReqToCallback is set true', async () => {
    class KeyCloakController {
      @get('/keycloak')
      @authenticate(STRATEGY.KEYCLOAK, {
        clientID: 'string',
        clientSecret: 'string',
        host: 'string',
        realm: 'string',
        callbackURL: 'string',
        authorizationURL: 'string',
        tokenURL: 'string',
        userInfoURL: 'string',
        passReqToCallback: true,
      })
      test() {
        return 'test successful';
      }
    }

    app.controller(KeyCloakController);

    await whenIMakeRequestTo(server).get('/keycloak').expect(200);
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
      .bind(Strategies.Passport.KEYCLOAK_VERIFIER)
      .toProvider(KeyCloakVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});
