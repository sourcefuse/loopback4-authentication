import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

import {KeycloakProfile, VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class KeycloakVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn> {
  constructor() {}

  value(): VerifyFunction.KeycloakAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: KeycloakProfile,
      cb: (err?: string | Error, user?: KeycloakProfile) => void,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.KeycloakAuthFn is not implemented`,
      );
    };
  }
}
