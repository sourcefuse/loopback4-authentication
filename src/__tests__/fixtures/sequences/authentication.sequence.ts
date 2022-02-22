import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from '../../../';
import {IAuthUser, IAuthClient} from '../../../types';
const SequenceActions = RestBindings.SequenceActions;

export class MyAuthenticationSequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateClientRequest: AuthenticateFn<
      IAuthClient | undefined
    >,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<IAuthUser | undefined>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];

      //call authentication action
      // await this.authenticateClientRequest(request);
      // await this.authenticateRequest(request);

      // Authentication successful, proceed to invoke controller
      const result = await this.invoke(route, args);
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
