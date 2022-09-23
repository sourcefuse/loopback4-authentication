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
  HttpErrors,
  Middleware,
  Response,
  MiddlewareContext,
  RestMiddlewareGroups,
  Request,
} from '@loopback/rest';
import {Strategy} from 'passport';
import {AuthErrorKeys} from '../error-keys';
import {AuthenticationBindings} from '../keys';
import {StrategyAdapter} from '../strategy-adapter';
import {AuthenticationMetadata, IAuthUser} from '../types';
import {AuthenticationMiddlewareGroups} from './middleware-groups.enum';

@injectable(
  asMiddleware({
    group: AuthenticationMiddlewareGroups.USER,
    upstreamGroups: RestMiddlewareGroups.PARSE_PARAMS,
    downstreamGroups: RestMiddlewareGroups.INVOKE_METHOD,
  }),
)
export class UserAuthenticationMiddlewareProvider
  implements Provider<Middleware>
{
  constructor(
    @inject.getter(AuthenticationBindings.USER_STRATEGY)
    readonly getStrategy: Getter<Strategy>,
    @inject.getter(AuthenticationBindings.USER_METADATA)
    private readonly getMetadata: Getter<AuthenticationMetadata>,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    readonly setCurrentUser: Setter<IAuthUser | undefined>,
  ) {}

  value() {
    const middleware = async (ctx: MiddlewareContext, next: Next) => {
      await this.action(ctx.request, ctx.response);
      return next();
    };
    return middleware;
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

    // Read decorator metadata to fetch options
    // to be passed on to authenticate method of strategy
    const metadata = await this.getMetadata();
    let authOpts;
    if (metadata?.authOptions) {
      // Fetch options using creator function added with decorator definition
      authOpts = metadata.authOptions(request);
    }

    const strategyAdapter = new StrategyAdapter<IAuthUser>(strategy);

    const user = await strategyAdapter.authenticate(
      request,
      response,
      authOpts,
    );

    if (user) {
      this.setCurrentUser(user);
      return user;
    }
  }
}
