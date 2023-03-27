import {Provider} from '@loopback/core';
import {VerifyFunction} from '../../../strategies';
import {Request} from 'express';
import {IAuthUser, IAuthClient, ClientType} from '../../../types';

export class ResourceOwnerVerifyProvider
  implements Provider<VerifyFunction.ResourceOwnerPasswordFn>
{
  constructor() {}

  value(): VerifyFunction.ResourceOwnerPasswordFn {
    return async (
      clientId: string,
      clientSecret: string,
      username: string,
      password: string,
      req?: Request,
    ) => {
      if (username === '' || clientId === '') {
        return null;
      }

      const userToPass: IAuthUser = {
        id: 1,
        username: username || 'xyz',
        password: password || 'pass',
      };

      const clientToPass: IAuthClient = {
        clientId: clientId || 'client id',
        clientSecret: clientSecret || 'client secret',
        clientType: ClientType.public,
      };

      return {user: userToPass, client: clientToPass};
    };
  }
}
