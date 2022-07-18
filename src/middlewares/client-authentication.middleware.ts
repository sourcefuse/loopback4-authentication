import {
  Getter,
  inject,
  injectable,
  Next,
  Provider,
  Setter,
} from '@loopback/core';
import {
  asMiddleware,
  Middleware,
  MiddlewareContext,
  RestMiddlewareGroups,
  Request,
} from '@loopback/rest';
import {Strategy} from 'passport';
import {AuthenticationBindings} from '../keys';
import {StrategyAdapter} from '../strategy-adapter';
import {IAuthClient} from '../types';
import {isObjectLike, isEmpty} from 'lodash';
import {AuthenticationMiddlewareGroups} from './middleware-groups.enum';

@injectable(
  asMiddleware({
    group: AuthenticationMiddlewareGroups.CLIENT,
    upstreamGroups: RestMiddlewareGroups.PARSE_PARAMS,
    downstreamGroups: [
      AuthenticationMiddlewareGroups.USER,
      RestMiddlewareGroups.INVOKE_METHOD,
    ],
  }),
)
export class ClientAuthenticationMiddlewareProvider
  implements Provider<Middleware>
{
  constructor(
    @inject.getter(AuthenticationBindings.CLIENT_STRATEGY)
    readonly getStrategy: Getter<Strategy>,
    @inject.setter(AuthenticationBindings.CURRENT_CLIENT)
    readonly setCurrentClient: Setter<IAuthClient | undefined>,
  ) {}

  value() {
    const middleware = async (ctx: MiddlewareContext, next: Next) => {
      await this.action(ctx.request);
      return next();
    };
    return middleware;
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
