import {Getter, inject, Provider, Setter} from '@loopback/context';
import {Request} from '@loopback/rest';
import {Strategy} from 'passport';

import {AuthenticationBindings} from '../keys';
import {StrategyAdapter} from '../strategy-adapter';
import {IAuthClient, AuthenticateFn} from '../types';

export class ClientAuthenticateActionProvider
  implements Provider<AuthenticateFn<IAuthClient | undefined>> {
  constructor(
    @inject.getter(AuthenticationBindings.CLIENT_STRATEGY)
    readonly getStrategy: Getter<Strategy>,
    @inject.setter(AuthenticationBindings.CURRENT_CLIENT)
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
    const strategyAdapter = new StrategyAdapter<IAuthClient>(strategy);
    const client: IAuthClient = await strategyAdapter.authenticate(request);
    this.setCurrentClient(client);
    return client;
  }
}
