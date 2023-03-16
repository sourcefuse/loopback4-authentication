import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of
 * VerifyFunction.ResourceOwnerPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class ResourceOwnerVerifyProvider
  implements Provider<VerifyFunction.ResourceOwnerPasswordFn>
{
  value(): VerifyFunction.ResourceOwnerPasswordFn {
    return async (clientId, clientSecret, username, password) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.ResourceOwnerPasswordFn is not implemented`,
      );
    };
  }
}
