import {Provider} from '@loopback/core';
import {VerifyFunction} from '../../../strategies';
import {ClientType, IAuthClient} from '../../../types';

export class ClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn>
{
  constructor() {}

  value() {
    return async (clientId: string, clientSecret: string) => {
      if (clientId === '') {
        return null;
      }

      const clientToPass: IAuthClient = {
        clientId: clientId || 'id',
        clientSecret: clientSecret || 'secret',
        clientType: ClientType.public,
      };

      return clientToPass;
    };
  }
}
