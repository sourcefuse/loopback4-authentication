import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';

const SequenceActions = RestBindings.SequenceActions;
export const enum CustomMiddlewareChain {
  PRE_INVOKE = 'pre-invoke',
  POST_INVOKE = 'post-invoke',
}

export class CustomSequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];

      // call custom registered middlewares in the pre-invoke chain
      let finished = await this.invokeMiddleware(context, {
        chain: CustomMiddlewareChain.PRE_INVOKE,
      });
      if (finished) return;

      const result = await this.invoke(route, args);

      context.bind('invocation.result').to(result);

      // call custom registered middlewares in the post-invoke chain
      finished = await this.invokeMiddleware(context, {
        chain: CustomMiddlewareChain.POST_INVOKE,
      });
      if (finished) return;
      this.send(response, result);
    } catch (error) {
      if (
        error.code === 'AUTHENTICATION_STRATEGY_NOT_FOUND' ||
        error.code === 'USER_PROFILE_NOT_FOUND'
      ) {
        Object.assign(error, {statusCode: 401 /* Unauthorized */});
      }
      this.reject(context, error);
      return;
    }
  }
}
