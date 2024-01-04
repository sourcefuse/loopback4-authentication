import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as FacebookStrategy from 'passport-facebook';
import {VerifyCallback, VerifyFunction} from '../../types';
/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class FacebookAuthVerifyProvider
  implements Provider<VerifyFunction.FacebookAuthFn>
{
  value(): VerifyFunction.FacebookAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: FacebookStrategy.Profile,
      cb: VerifyCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.FacebookAuthFn is not implemented`,
      );
    };
  }
}
