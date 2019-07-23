import {Provider} from '@loopback/core';
import {VerifyFunction} from '../../../strategies';
import * as GoogleStrategy from 'passport-google-oauth20';
import {IAuthUser} from '../../../types';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.GoogleAuthFn> {
  constructor() {}

  value() {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
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
