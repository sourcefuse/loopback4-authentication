import {Getter, inject, Provider, Setter} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {Strategy} from 'passport';

import {AuthErrorKeys} from '../error-keys';
import {AuthenticationBindings} from '../keys';
import {StrategyAdapter} from '../strategy-adapter';
import {AuthenticateFn, IAuthUser} from '../types';

export class AuthenticateActionProvider
  implements Provider<AuthenticateFn<IAuthUser | undefined>> {
  constructor(
    @inject.getter(AuthenticationBindings.USER_STRATEGY)
    readonly getStrategy: Getter<Strategy>,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    readonly setCurrentUser: Setter<IAuthUser | undefined>,
  ) {}

  value(): AuthenticateFn<IAuthUser | undefined> {
    return request => this.action(request);
  }

  async action(request: Request): Promise<IAuthUser | undefined> {
    const strategy = await this.getStrategy();
    if (!strategy) {
      this.setCurrentUser(undefined);
      return undefined;
    }
    if (!strategy.authenticate) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.UnknownError);
    }
    const strategyAdapter = new StrategyAdapter<IAuthUser>(strategy);
    const user: IAuthUser = await strategyAdapter.authenticate(request);
    this.setCurrentUser(user);
    return user;
  }
}
