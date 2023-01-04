import {Provider} from '@loopback/core';
import {VerifyFunction} from '../../../strategies';
import * as SamlStrategy from 'passport-saml';
import {IAuthUser} from '../../../types';
import {Request} from '@loopback/rest';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.SamlFn>
{
  constructor() {
    //this is intentional
  }

  value(): VerifyFunction.SamlFn {
    return async (
      profile: SamlStrategy.Profile,
      cb: SamlStrategy.VerifiedCallback,
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
