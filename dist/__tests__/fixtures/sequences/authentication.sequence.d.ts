import { FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceHandler } from '@loopback/rest';
import { AuthenticateFn } from '../../../';
import { IAuthUser, IAuthClient } from '../../../types';
export declare class MyAuthenticationSequence implements SequenceHandler {
    protected findRoute: FindRoute;
    protected parseParams: ParseParams;
    protected invoke: InvokeMethod;
    protected send: Send;
    protected reject: Reject;
    protected authenticateClientRequest: AuthenticateFn<IAuthClient | undefined>;
    protected authenticateRequest: AuthenticateFn<IAuthUser | undefined>;
    constructor(findRoute: FindRoute, parseParams: ParseParams, invoke: InvokeMethod, send: Send, reject: Reject, authenticateClientRequest: AuthenticateFn<IAuthClient | undefined>, authenticateRequest: AuthenticateFn<IAuthUser | undefined>);
    handle(context: RequestContext): Promise<void>;
}
