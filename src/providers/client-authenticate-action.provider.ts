import {Getter, inject, Provider, Setter} from '@loopback/context';
import {Request} from '@loopback/rest';
import {Strategy} from 'passport';

import {ExtAuthenticationBindings} from '../keys';
import {ExtStrategyAdapter} from '../strategy-adapter';
import {IAuthClient, AuthenticateFn} from '../types';
import {isObjectLike, isEmpty} from 'lodash';

export class ClientAuthenticateActionProvider
  implements Provider<AuthenticateFn<IAuthClient | undefined>> {
  constructor(
    @inject.getter(ExtAuthenticationBindings.CLIENT_STRATEGY)
    readonly getStrategy: Getter<Strategy>,
    @inject.setter(ExtAuthenticationBindings.CURRENT_CLIENT)
    readonly setCurrentClient: Setter<IAuthClient | undefined>,
  ) {}

  value(): AuthenticateFn<IAuthClient | undefined> {
    return request => this.action(request);
  }

  async action(request: Request): Promise<IAuthClient | undefined> {
    const strategy = await this.getStrategy();
    if (!strategy) {
      this.setCurrentClient(undefined);
      return undefined;
    }
    if (!strategy.authenticate) {
      throw new Error('invalid strategy parameter');
    }
    const strategyAdapter = new ExtStrategyAdapter<IAuthClient>(strategy);
    // Added for cases, where data is passed not in body but in query parameter
    if (!request.body || !isObjectLike(request.body) || isEmpty(request.body)) {
      request.body = request.query;
    }
    const client: IAuthClient = await strategyAdapter.authenticate(request);
    this.setCurrentClient(client);
    return client;
  }
}
