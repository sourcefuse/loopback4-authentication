import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export declare class FacebookAuthVerifyProvider implements Provider<VerifyFunction.FacebookAuthFn> {
    constructor();
    value(): VerifyFunction.FacebookAuthFn;
}
