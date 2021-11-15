import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import * as AzureADStrategy from 'passport-azure-ad';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class AzureADAuthVerifyProvider
  implements Provider<VerifyFunction.AzureADAuthFn>
{
  constructor() {}

  value(): VerifyFunction.AzureADAuthFn {
    return async (
      profile: AzureADStrategy.IProfile,
      done: AzureADStrategy.VerifyCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.AzureADAuthFn is not implemented`,
      );
    };
  }
}
