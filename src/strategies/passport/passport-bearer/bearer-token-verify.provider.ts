import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.BearerFn
 *
 * It will just throw an error saying Not Implemented
 */
export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.BearerFn is not implemented`,
      );
    };
  }
}
