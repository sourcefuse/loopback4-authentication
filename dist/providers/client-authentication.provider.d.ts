/// <reference types="express" />
import { Getter, Provider, Setter } from '@loopback/context';
import { Request } from '@loopback/rest';
import { Strategy } from 'passport';
import { IAuthClient, AuthenticateFn } from '../types';
export declare class ClientAuthenticateActionProvider implements Provider<AuthenticateFn<IAuthClient | undefined>> {
    readonly getStrategy: Getter<Strategy>;
    readonly setCurrentClient: Setter<IAuthClient | undefined>;
    constructor(getStrategy: Getter<Strategy>, setCurrentClient: Setter<IAuthClient | undefined>);
    value(): AuthenticateFn<IAuthClient | undefined>;
    action(request: Request): Promise<IAuthClient | undefined>;
}
