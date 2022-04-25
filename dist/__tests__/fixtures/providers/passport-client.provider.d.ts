import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../../strategies';
import { IAuthClient } from '../../../types';
export declare class ClientPasswordVerifyProvider implements Provider<VerifyFunction.OauthClientPasswordFn> {
    constructor();
    value(): (clientId: string, clientSecret: string) => Promise<IAuthClient | null>;
}
