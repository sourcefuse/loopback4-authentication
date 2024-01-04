import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

import {VerifyFunction} from '../../types';

export class OtpVerifyProvider implements Provider<VerifyFunction.OtpAuthFn> {
  value(): VerifyFunction.OtpAuthFn {
    return async (_key: string, _otp: string) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.OtpAuthFn is not implemented`,
      );
    };
  }
}
