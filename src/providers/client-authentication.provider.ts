import {Getter, inject, Provider, Setter} from '@loopback/context';
import {Request} from '@loopback/rest';
import {Strategy} from '../strategies/passport/passport-client-password/client-password-strategy';

import {AuthenticationBindings} from '../keys';
import {StrategyAdapter} from '../strategy-adapter';
import {IAuthClient, AuthenticateFn} from '../types';
import {isObjectLike, isEmpty} from 'lodash';

export class ClientAuthenticateActionProvider
  implements Provider<AuthenticateFn<IAuthClient | undefined>>
{
  constructor(
    @inject.getter(AuthenticationBindings.CLIENT_STRATEGY)
    readonly getStrategy: Getter<Strategy>,
    @inject.setter(AuthenticationBindings.CURRENT_CLIENT)
    readonly setCurrentClient: Setter<IAuthClient | undefined>,
  ) {}

  value(): AuthenticateFn<IAuthClient | undefined> {
    return (request) => this.action(request);
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
    // Added for cases, where data is passed not in body but in query parameter
    if (!request.body || !isObjectLike(request.body) || isEmpty(request.body)) {
      request.body = request.query;
    }
    const client = await strategyAdapter.authenticate(request);
    if (client) {
      this.setCurrentClient(client);
      return client;
    }
  }
}
