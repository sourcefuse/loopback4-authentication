import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn> {
  constructor() {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (username: string, password: string) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.LocalPasswordFn is not implemented`,
      );
    };
  }
}
