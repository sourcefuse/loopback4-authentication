import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../../strategies';
export declare class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
    constructor();
    value(): VerifyFunction.BearerFn;
}
