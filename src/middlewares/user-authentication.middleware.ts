import {inject, injectable, Next, Provider} from '@loopback/core';
import {
  asMiddleware,
  Middleware,
  MiddlewareContext,
  RestMiddlewareGroups,
} from '@loopback/rest';
import {AuthenticationBindings} from '../keys';
import {AuthenticateFn, IAuthUser} from '../types';
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
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    private authenticateUser: AuthenticateFn<IAuthUser | undefined>,
  ) {}

  value() {
    const middleware = async (ctx: MiddlewareContext, next: Next) => {
      await this.authenticateUser(ctx.request, ctx.response);
      return next();
    };
    return middleware;
  }
}
