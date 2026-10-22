import {Application} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {RestServer} from '@loopback/rest';
import {Client, createClientForHandler, expect} from '@loopback/testlab';
import {authenticate} from '../../../../decorators';
import {STRATEGY} from '../../../../strategy-name.enum';
import {MyAuthenticationSequence} from '../../../fixtures/sequences/authentication.sequence';
import {getApp} from '../helpers/helpers';

describe('strategy that is not available', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  afterEach(() => app.close());

  it('should return 404 without exposing internals when the provider is not bound', async () => {
    class TestController {
      @get('/test')
      @authenticate(STRATEGY.APPLE_OAUTH2, {
        clientID: 'string',
        clientSecret: 'string',
      })
      test() {
        return 'test successful';
      }
    }

    app.controller(TestController);

    const res = await whenIMakeRequestTo(server).get('/test').expect(404);
    expect(res.body.error.message).to.equal(
      'The requested resource is not available',
    );
    expect(JSON.stringify(res.body)).to.not.containEql('sf.passport');
  });

  it('should return 404 for an unknown strategy name', async () => {
    class TestController {
      @get('/test2')
      @authenticate('not-a-strategy' as STRATEGY)
      test() {
        return 'test successful';
      }
    }

    app.controller(TestController);

    await whenIMakeRequestTo(server).get('/test2').expect(404);
  });

  function whenIMakeRequestTo(restServer: RestServer): Client {
    return createClientForHandler(restServer.requestHandler);
  }

  async function givenAServer() {
    app = getApp();
    server = await app.getServer(RestServer);
    server.sequence(MyAuthenticationSequence);
  }
});
