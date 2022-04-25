import { Provider } from '@loopback/core';
import * as PassportBearer from 'passport-http-bearer';
import { VerifyFunction } from '../../types';
export interface BearerStrategyFactory {
    (options?: PassportBearer.IStrategyOptions, verifierPassed?: VerifyFunction.BearerFn): PassportBearer.Strategy<VerifyFunction.BearerFn>;
}
export declare class BearerStrategyFactoryProvider implements Provider<BearerStrategyFactory> {
    private readonly verifierBearer;
    constructor(verifierBearer: VerifyFunction.BearerFn);
    value(): BearerStrategyFactory;
    getBearerStrategyVerifier(options?: PassportBearer.IStrategyOptions, verifierPassed?: VerifyFunction.BearerFn): PassportBearer.Strategy<VerifyFunction.BearerFn>;
}
