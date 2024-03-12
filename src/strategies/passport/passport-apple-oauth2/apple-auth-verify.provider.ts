import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';

import * as AppleStrategy from 'passport-apple';

import {DecodedIdToken} from 'passport-apple';

import {VerifyFunction} from '../../types';

export class AppleAuthVerifyProvider
  implements Provider<VerifyFunction.AppleAuthFn>
{
  value(): VerifyFunction.AppleAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      decodedIdToken: DecodedIdToken,
      profile: AppleStrategy.Profile,
      cb: AppleStrategy.VerifyCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.AppleAuthFn is not implemented`,
      );
    };
  }
}
