import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export declare class InstagramAuthVerifyProvider implements Provider<VerifyFunction.InstagramAuthFn> {
    constructor();
    value(): VerifyFunction.InstagramAuthFn;
}
