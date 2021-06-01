import {Provider} from '@loopback/core';
import {VerifyFunction} from '../../../strategies';
import {IAuthUser} from '../../../types';
import {Request} from '@loopback/rest';
import {Keycloak} from '../../../strategies/keycloak-type';

export class KeyCloakVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn> {
  constructor() {}

  value() {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Keycloak.Profile,
      cb: (err?: string | Error, user?: IAuthUser) => void,
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
