import {Provider} from '@loopback/core';
import {VerifyCallback, VerifyFunction} from '../../../strategies';
import * as InstagramStrategy from 'passport-instagram';
import {IAuthUser} from '../../../types';
import {Request} from '@loopback/rest';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.InstagramAuthFn>
{
  constructor() {}

  value() {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: InstagramStrategy.Profile,
      cb: VerifyCallback,
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
