import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as GoogleStrategy from 'passport-google-oauth20';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class GoogleAuthVerifyProvider
  implements Provider<VerifyFunction.GoogleAuthFn>
{
  constructor() {}

  value(): VerifyFunction.GoogleAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
      cb: GoogleStrategy.VerifyCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.GoogleAuthFn is not implemented`,
      );
    };
  }
}
