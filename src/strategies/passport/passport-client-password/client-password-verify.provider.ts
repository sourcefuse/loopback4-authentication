import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.OauthClientPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class ClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn>
{
  constructor() {//this is intentional
  }

  value(): VerifyFunction.OauthClientPasswordFn {
    return async (clientId: string, clientSecret: string) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.OauthClientPasswordFn is not implemented`,
      );
    };
  }
}
