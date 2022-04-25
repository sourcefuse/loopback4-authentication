import { Provider } from '@loopback/core';
import * as PassportLocal from 'passport-local';
import { VerifyFunction } from '../../types';
export interface LocalPasswordStrategyFactory {
    (options?: PassportLocal.IStrategyOptions | PassportLocal.IStrategyOptionsWithRequest, verifierPassed?: VerifyFunction.LocalPasswordFn): PassportLocal.Strategy;
}
export declare class LocalPasswordStrategyFactoryProvider implements Provider<LocalPasswordStrategyFactory> {
    private readonly verifierLocal;
    constructor(verifierLocal: VerifyFunction.LocalPasswordFn);
    value(): LocalPasswordStrategyFactory;
    getLocalStrategyVerifier(options?: PassportLocal.IStrategyOptions | PassportLocal.IStrategyOptionsWithRequest, verifierPassed?: VerifyFunction.LocalPasswordFn): PassportLocal.Strategy;
}
