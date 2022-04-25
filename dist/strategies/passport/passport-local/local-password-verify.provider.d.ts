import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export declare class LocalPasswordVerifyProvider implements Provider<VerifyFunction.LocalPasswordFn> {
    constructor();
    value(): VerifyFunction.LocalPasswordFn;
}
