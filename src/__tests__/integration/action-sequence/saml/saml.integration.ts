import {Client, createClientForHandler} from '@loopback/testlab';
import {RestServer, Request} from '@loopback/rest';
import {Application, Provider} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticate} from '../../../../decorators';
import {STRATEGY} from '../../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationSequence} from '../../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../../strategies/keys';
import {VerifyFunction} from '../../../../strategies';
import {userWithoutReqObj} from '../../../fixtures/data/bearer-data';
import * as SamlStrategy from 'passport-saml';

describe('getting saml strategy with options', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 302 when client id is passed and passReqToCallback is set true', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.SAML, {
        name: 'string',
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
    app.bind(Strategies.SAML_VERIFIER).toProvider(SamlVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});

class SamlVerifyProvider implements Provider<VerifyFunction.SamlFn> {
  constructor() {
    //this is intentional
  }

  value(): VerifyFunction.SamlFn {
    return async (
      profile: SamlStrategy.Profile,
      cd: SamlStrategy.VerifiedCallback,
      req?: Request,
    ) => {
      return userWithoutReqObj;
    };
  }
}
