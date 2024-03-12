import {Constructor, Getter, inject, Provider, Setter} from '@loopback/context';
import {HttpErrors, Request, Response} from '@loopback/rest';
import {Strategy} from 'passport';

import {AuthErrorKeys} from '../error-keys';
import {AuthenticationBindings} from '../keys';
import {StrategyAdapter} from '../strategy-adapter';
import {
  AuthenticateFn,
  IAuthUser,
  AuthenticationMetadata,
  EntityWithIdentifier,
} from '../types';

export class AuthenticateActionProvider
  implements Provider<AuthenticateFn<IAuthUser | undefined>>
{
  constructor(
    @inject.getter(AuthenticationBindings.USER_STRATEGY)
    readonly getStrategy: Getter<Strategy>,
    @inject.getter(AuthenticationBindings.USER_METADATA)
    private readonly getMetadata: Getter<AuthenticationMetadata>,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    readonly setCurrentUser: Setter<IAuthUser | undefined>,
    @inject(AuthenticationBindings.USER_MODEL, {optional: true})
    public authUserModel?: Constructor<EntityWithIdentifier & IAuthUser>,
  ) {}

  value(): AuthenticateFn<IAuthUser | undefined> {
    return (request, response) => this.action(request, response);
  }

  async action(
    request: Request,
    response?: Response,
  ): Promise<IAuthUser | undefined> {
    const strategy = await this.getStrategy();
    if (!strategy) {
      this.setCurrentUser(undefined);
      return undefined;
    }
    if (!strategy.authenticate) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.UnknownError);
    }

    /**
     * Read decorator metadata to fetch options
     * to be passed on to authenticate method of strategy */
    const metadata = await this.getMetadata();
    let authOpts;
    if (metadata?.authOptions) {
      // Fetch options using creator function added with decorator definition
      authOpts = metadata.authOptions(request);
    }
    const strategyAdapter = new StrategyAdapter<IAuthUser>(strategy);
    let user = await strategyAdapter.authenticate(request, response, authOpts);
    if (user) {
      if (this.authUserModel) {
        user = new this.authUserModel(user);
      }
      this.setCurrentUser(user);
      return user;
    }
  }
}
