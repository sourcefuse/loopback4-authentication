import { inject, Provider } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';

import { AuthErrorKeys } from '../../../error-keys';
import { IAuthClient, IAuthUser } from '../../../types';
import { Strategies } from '../../keys';
import { VerifyFunction } from '../../types';
import { Oauth2ResourceOwnerPassword } from './oauth2-resource-owner-password-grant';
import { isEmpty } from 'lodash';

export interface ResourceOwnerPasswordStrategyFactory {
  (
    options?: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
    verifierPassed?: VerifyFunction.ResourceOwnerPasswordFn
  ): Oauth2ResourceOwnerPassword.Strategy;
}

export class ResourceOwnerPasswordStrategyFactoryProvider
  implements Provider<ResourceOwnerPasswordStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
    private readonly verifierResourceOwner: VerifyFunction.ResourceOwnerPasswordFn,
  ) { }

  value(): ResourceOwnerPasswordStrategyFactory {
    return (options, verifier) => this.getResourceOwnerVerifier(options, verifier);
  }

  getResourceOwnerVerifier(
    options?: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
    verifierPassed?: VerifyFunction.ResourceOwnerPasswordFn
  ): Oauth2ResourceOwnerPassword.Strategy {
    const verifyFn = verifierPassed ?? this.verifierResourceOwner;
    if (options?.passReqToCallback) {
      return new Oauth2ResourceOwnerPassword.Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          req: Request,
          clientId: string,
          clientSecret: string,
          username: string,
          password: string,
          cb: (
            err: Error | null,
            client?: IAuthClient | false,
            user?: IAuthUser | false,
          ) => void,
        ) => {
          try {
            const userInfo = await verifyFn(
              clientId,
              clientSecret,
              username,
              password,
              req,
            );
            if (!userInfo || isEmpty(userInfo)) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, userInfo.client, userInfo.user);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else {
      return new Oauth2ResourceOwnerPassword.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          clientId: string,
          clientSecret: string,
          username: string,
          password: string,
          cb: (
            err: Error | null,
            client?: IAuthClient | false,
            user?: IAuthUser | false,
          ) => void,
        ) => {
          try {
            const userInfo = await verifyFn(
              clientId,
              clientSecret,
              username,
              password,
            );
            if (!userInfo || isEmpty(userInfo)) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, userInfo.client, userInfo.user);
          } catch (err) {
            cb(err);
          }
        },
      );
    }
  }
}
