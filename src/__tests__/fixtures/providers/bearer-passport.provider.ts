import {Provider} from '@loopback/core';
import {Request} from '@loopback/rest';

import {VerifyFunction} from '../../../strategies';
import {
  userWithoutReqObj,
  userWhenReqObj,
  validToken,
} from '../data/bearer-data';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async (token: string, req?: Request) => {
      if (token !== validToken) {
        return null;
      }

      if (req) {
        return userWhenReqObj;
      }

      return userWithoutReqObj;
    };
  }
}
