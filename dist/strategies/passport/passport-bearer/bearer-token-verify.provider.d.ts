import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
/**
 * A provider for default implementation of VerifyFunction.BearerFn
 *
 * It will just throw an error saying Not Implemented
 */
export declare class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
    constructor();
    value(): VerifyFunction.BearerFn;
}
