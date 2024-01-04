import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as InstagramStrategy from 'passport-instagram';
import {VerifyCallback, VerifyFunction} from '../../types';
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class InstagramAuthVerifyProvider
  implements Provider<VerifyFunction.InstagramAuthFn>
{
  value(): VerifyFunction.InstagramAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: InstagramStrategy.Profile,
      cb: VerifyCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.InstagramAuthFn is not implemented`,
      );
    };
  }
}
