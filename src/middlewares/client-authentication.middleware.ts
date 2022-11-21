import {inject, injectable, Next, Provider} from '@loopback/core';
import {
  asMiddleware,
  Middleware,
  MiddlewareContext,
  RestMiddlewareGroups,
} from '@loopback/rest';
import {AuthenticationBindings} from '../keys';
import {AuthenticateFn, IAuthClient} from '../types';
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
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    private authenticateClient: AuthenticateFn<IAuthClient | undefined>,
  ) {}

  value() {
    const middleware = async (ctx: MiddlewareContext, next: Next) => {
      await this.authenticateClient(ctx.request);
      return next();
    };
    return middleware;
  }
}
