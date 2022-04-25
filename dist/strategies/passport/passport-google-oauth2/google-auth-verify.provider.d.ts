import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export declare class GoogleAuthVerifyProvider implements Provider<VerifyFunction.GoogleAuthFn> {
    constructor();
    value(): VerifyFunction.GoogleAuthFn;
}
