import { Provider } from '@loopback/context';
import { VerifyFunction } from '../../types';
export declare class OtpVerifyProvider implements Provider<VerifyFunction.OtpAuthFn> {
    constructor();
    value(): VerifyFunction.OtpAuthFn;
}
