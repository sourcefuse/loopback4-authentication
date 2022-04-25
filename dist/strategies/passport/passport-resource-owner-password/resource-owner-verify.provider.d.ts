import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
/**
 * A provider for default implementation of
 * VerifyFunction.ResourceOwnerPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export declare class ResourceOwnerVerifyProvider implements Provider<VerifyFunction.ResourceOwnerPasswordFn> {
    constructor();
    value(): VerifyFunction.ResourceOwnerPasswordFn;
}
