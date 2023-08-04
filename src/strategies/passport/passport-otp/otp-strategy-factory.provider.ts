import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
import {Otp} from './otp-auth';

export type PassportOtpStrategyFactory = (
  options: Otp.StrategyOptions,
  verifierPassed?: VerifyFunction.OtpAuthFn,
) => Otp.Strategy;

export class PassportOtpStrategyFactoryProvider
  implements Provider<PassportOtpStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.OTP_VERIFIER)
    private readonly verifierOtp: VerifyFunction.OtpAuthFn,
  ) {}

  value(): PassportOtpStrategyFactory {
    return (options, verifier) =>
      this.getPassportOtpStrategyVerifier(options, verifier);
  }

  getPassportOtpStrategyVerifier(
    options?: Otp.StrategyOptions,
    verifierPassed?: VerifyFunction.OtpAuthFn,
  ): Otp.Strategy {
    const verifyFn = verifierPassed ?? this.verifierOtp;
    return new Otp.Strategy(
      options,
      (key: string, otp: string, cb: Otp.VerifyCallback) => {
        verifyFn(key, otp)
          .then((user) => {
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, user);
          })
          .catch((err) => {
            cb(err);
          });
      },
    );
  }
}
