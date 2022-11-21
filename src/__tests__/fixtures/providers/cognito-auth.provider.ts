import {Provider} from '@loopback/context';
import {Request} from '@loopback/rest';
import {Cognito, IAuthUser, VerifyFunction} from '../../../types';

/**
 * A provider for default implementation of VerifyFunction.CognitoAuthFn
 *
 * It will just throw an error saying Not Implemented
 */
export class BearerTokenVerifyProvider
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
      const userToPass: IAuthUser = {
        id: 1,
        username: 'xyz',
        password: 'pass',
      };

      return userToPass;
    };
  }
}
