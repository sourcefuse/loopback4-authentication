import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

import {Keycloak, VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class KeycloakVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn>
{
  constructor() {//this is intentional
  }

  value(): VerifyFunction.KeycloakAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Keycloak.Profile,
      cb: Keycloak.VerifyCallback,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.KeycloakAuthFn is not implemented`,
      );
    };
  }
}
