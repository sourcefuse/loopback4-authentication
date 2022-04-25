import { Provider, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import { AuthenticationMetadata } from '../types';
import { ClientPasswordStrategyFactory } from './passport/passport-client-password';
export declare class ClientAuthStrategyProvider implements Provider<Strategy | undefined> {
    private readonly clientMetadata;
    private readonly getClientPasswordVerifier;
    constructor(clientMetadata: AuthenticationMetadata, getClientPasswordVerifier: ClientPasswordStrategyFactory);
    value(): ValueOrPromise<Strategy | undefined>;
}
