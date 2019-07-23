import {Provider} from '@loopback/core';
import {VerifyFunction} from '../../../strategies';
import {IAuthUser} from '../../../types';
import {Request} from '@loopback/rest';

export class LocalVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn> {
  constructor() {}

  value() {
    return async (username: string, password: string, req?: Request) => {
      if (!username || !password) {
        return null;
      }

      if (username === '') {
        return null;
      }

      const userToPass: IAuthUser = {
        id: 1,
        username,
        password,
      };

      return userToPass;
    };
  }
}
