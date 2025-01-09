import {Application} from '@loopback/core';
import {RestComponent, RestServer} from '@loopback/rest';
import {AuthenticationComponent} from '../../../../component';

import {
  ClientAuthenticationMiddlewareProvider,
  UserAuthenticationMiddlewareProvider,
} from '../../../..';
import {CustomMiddlewareChain} from '../../../fixtures/sequences/custom-middleware.sequence';

export function getApp(): Application {
  const app = new Application();
  app.component(AuthenticationComponent);
  app.component(RestComponent);
  return app;
}

export async function givenCustomMiddlewareServer(app: Application) {
  const server = await app.getServer(RestServer);
  server.middleware(ClientAuthenticationMiddlewareProvider, {
    chain: CustomMiddlewareChain.PRE_INVOKE,
  });
  server.middleware(UserAuthenticationMiddlewareProvider, {
    chain: CustomMiddlewareChain.PRE_INVOKE,
  });
  return server;
}
