import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../../strategies';
export declare class LocalVerifyProvider implements Provider<VerifyFunction.LocalPasswordFn> {
    constructor();
    value(): VerifyFunction.LocalPasswordFn;
}
