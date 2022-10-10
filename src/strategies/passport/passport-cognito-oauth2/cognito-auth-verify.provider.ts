import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {Cognito, VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.CognitoAuthFn
 *
 * It will just throw an error saying Not Implemented
 */
export class CognitoAuthVerifyProvider
  implements Provider<VerifyFunction.CognitoAuthFn>
{
  constructor() {}

  value(): VerifyFunction.CognitoAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Cognito.Profile,
      cb: Cognito.VerifyCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.CognitoAuthFn is not implemented`,
      );
    };
  }
}
