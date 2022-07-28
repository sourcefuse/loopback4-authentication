import {Provider} from '@loopback/core';
import {VerifyFunction} from '../../../strategies';
import * as AzureADAuthStrategy from 'passport-azure-ad';
import {IAuthUser} from '../../../types';
import {Request} from '@loopback/rest';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.AzureADAuthFn>
{
  constructor() {}

  value(): VerifyFunction.AzureADAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: AzureADAuthStrategy.IProfile,
      done: AzureADAuthStrategy.VerifyCallback,
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
