import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthClient, IAuthUser} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
import {Oauth2ResourceOwnerPassword} from './oauth2-resource-owner-password-grant';
import {isEmpty} from 'lodash';

export type ResourceOwnerPasswordStrategyFactory = (
  options?: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
  verifierPassed?: VerifyFunction.ResourceOwnerPasswordFn,
) => Oauth2ResourceOwnerPassword.Strategy;

export class ResourceOwnerPasswordStrategyFactoryProvider
  implements Provider<ResourceOwnerPasswordStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
    private readonly verifierResourceOwner: VerifyFunction.ResourceOwnerPasswordFn,
  ) {}

  value(): ResourceOwnerPasswordStrategyFactory {
    return (options, verifier) =>
      this.getResourceOwnerVerifier(options, verifier);
  }

  getResourceOwnerVerifier(
    options?: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface,
    verifierPassed?: VerifyFunction.ResourceOwnerPasswordFn,
  ): Oauth2ResourceOwnerPassword.Strategy {
    const verifyFn = verifierPassed ?? this.verifierResourceOwner;

    if (options?.passReqToCallback) {
      return new Oauth2ResourceOwnerPassword.Strategy(
        options,
        this.getResourceOwnerStrategyWithRequest(verifyFn),
      );
    } else {
      return new Oauth2ResourceOwnerPassword.Strategy(
        this.getResourceOwnerStrategyWithoutRequest(verifyFn),
      );
    }
  }

  getResourceOwnerStrategyWithRequest(
    verifyFn: VerifyFunction.ResourceOwnerPasswordFn,
  ) {
    return (
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
      verifyFn(clientId, clientSecret, username, password, req)
        .then(userInfo => {
          if (!userInfo || isEmpty(userInfo)) {
            throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
          }
          cb(null, userInfo.client, userInfo.user);
        })
        .catch(err => {
          cb(err);
        });
    };
  }

  getResourceOwnerStrategyWithoutRequest(
    verifyFn: VerifyFunction.ResourceOwnerPasswordFn,
  ) {
    return (
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
      verifyFn(clientId, clientSecret, username, password)
        .then(userInfo => {
          if (!userInfo || isEmpty(userInfo)) {
            throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
          }
          cb(null, userInfo.client, userInfo.user);
        })
        .catch(err => {
          cb(err);
        });
    };
  }
}
