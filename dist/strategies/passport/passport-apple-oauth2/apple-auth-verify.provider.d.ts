import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
export declare class AppleAuthVerifyProvider implements Provider<VerifyFunction.AppleAuthFn> {
    constructor();
    value(): VerifyFunction.AppleAuthFn;
}
