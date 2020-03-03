import {Application} from '@loopback/core';
import {ExtAuthenticationComponent} from '../../../component';
import {RestComponent} from '@loopback/rest';

/**
 *Gives an instance of application
 */
export function getApp(): Application {
  const app = new Application();
  app.component(ExtAuthenticationComponent);
  app.component(RestComponent);
  return app;
}
