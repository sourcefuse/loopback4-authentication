/// <reference types="express" />
import { Getter, Provider, Setter } from '@loopback/context';
import { Request, Response } from '@loopback/rest';
import { Strategy } from 'passport';
import { AuthenticateFn, IAuthUser, AuthenticationMetadata } from '../types';
export declare class AuthenticateActionProvider implements Provider<AuthenticateFn<IAuthUser | undefined>> {
    readonly getStrategy: Getter<Strategy>;
    private readonly getMetadata;
    readonly setCurrentUser: Setter<IAuthUser | undefined>;
    constructor(getStrategy: Getter<Strategy>, getMetadata: Getter<AuthenticationMetadata>, setCurrentUser: Setter<IAuthUser | undefined>);
    value(): AuthenticateFn<IAuthUser | undefined>;
    action(request: Request, response?: Response): Promise<IAuthUser | undefined>;
}
