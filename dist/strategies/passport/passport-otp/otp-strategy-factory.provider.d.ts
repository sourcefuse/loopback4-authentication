import { Provider } from '@loopback/core';
import { VerifyFunction } from '../../types';
import { Otp } from './otp-auth';
export interface PassportOtpStrategyFactory {
    (options: Otp.StrategyOptions, verifierPassed?: VerifyFunction.OtpAuthFn): Otp.Strategy;
}
export declare class PassportOtpStrategyFactoryProvider implements Provider<PassportOtpStrategyFactory> {
    private readonly verifierOtp;
    constructor(verifierOtp: VerifyFunction.OtpAuthFn);
    value(): PassportOtpStrategyFactory;
    getPassportOtpStrategyVerifier(options?: Otp.StrategyOptions, verifierPassed?: VerifyFunction.OtpAuthFn): Otp.Strategy;
}
