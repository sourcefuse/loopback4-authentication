import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../../strategies';
export declare class ResourceOwnerVerifyProvider implements Provider<VerifyFunction.ResourceOwnerPasswordFn> {
    constructor();
    value(): VerifyFunction.ResourceOwnerPasswordFn;
}
