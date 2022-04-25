import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
/**
 * A provider for default implementation of VerifyFunction.OauthClientPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export declare class ClientPasswordVerifyProvider implements Provider<VerifyFunction.OauthClientPasswordFn> {
    constructor();
    value(): VerifyFunction.OauthClientPasswordFn;
}
