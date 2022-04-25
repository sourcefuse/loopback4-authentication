/// <reference types="qs" />
/// <reference types="express" />
import { Provider } from '@loopback/core';
import { VerifyCallback, VerifyFunction } from '../../../strategies';
import * as InstagramStrategy from 'passport-instagram';
import { IAuthUser } from '../../../types';
import { Request } from '@loopback/rest';
export declare class BearerTokenVerifyProvider implements Provider<VerifyFunction.InstagramAuthFn> {
    constructor();
    value(): (accessToken: string, refreshToken: string, profile: InstagramStrategy.Profile, cb: VerifyCallback, req?: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined) => Promise<IAuthUser>;
}
