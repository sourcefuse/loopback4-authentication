import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import * as AppleStrategy from 'passport-apple';

import {DecodedIdToken} from 'passport-apple';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class AppleAuthVerifyProvider
  implements Provider<VerifyFunction.AppleAuthFn> {
  constructor() {}

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
