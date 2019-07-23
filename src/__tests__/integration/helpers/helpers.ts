import {Application} from '@loopback/core';
import {AuthenticationComponent} from '../../../component';
import {RestComponent} from '@loopback/rest';

/**
 *Gives an instance of application
 */
export function getApp(): Application {
  const app = new Application();
  app.component(AuthenticationComponent);
  app.component(RestComponent);
  return app;
}
