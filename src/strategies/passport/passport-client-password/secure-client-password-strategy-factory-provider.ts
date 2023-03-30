import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import * as ClientPasswordStrategy from './client-password-strategy';

import {AuthErrorKeys} from '../../../error-keys';
import {ClientType, IAuthClient, IAuthSecureClient} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

export interface SecureClientPasswordStrategyFactory {
  (
    options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface,
    verifierPassed?: VerifyFunction.OauthSecureClientPasswordFn,
  ): ClientPasswordStrategy.Strategy;
}

export class SecureClientPasswordStrategyFactoryProvider
  implements Provider<SecureClientPasswordStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
    private readonly verifier: VerifyFunction.OauthSecureClientPasswordFn,
  ) {}

  value(): SecureClientPasswordStrategyFactory {
    return (options, verifier) =>
      this.getSecureClientPasswordVerifier(options, verifier);
  }

  getSecureClientPasswordVerifier(
    options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface,
    verifierPassed?: VerifyFunction.OauthSecureClientPasswordFn,
  ): ClientPasswordStrategy.Strategy {
    const verifyFn = verifierPassed ?? this.verifier;
    if (options?.passReqToCallback) {
      return new ClientPasswordStrategy.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          clientId: string,
          clientSecret: string | undefined,
          cb: (err: Error | null, client?: IAuthSecureClient | false) => void,
          req: Request | undefined,
        ) => {
          try {
            const client = await verifyFn(clientId, clientSecret, req);
            if (!client) {
              throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
            } else if (
              client.clientType !== ClientType.public &&
              !clientSecret
            ) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.ConfidentialClientSecretMissing,
              );
            } else if (
              (client.clientType !== ClientType.public &&
                !client.clientSecret) ||
              client.clientSecret !== clientSecret
            ) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.ClientVerificationFailed,
              );
            } else {
              // do nothing
            }

            cb(null, client);
          } catch (err) {
            cb(err);
          }
        },
        options,
      );
    } else {
      return new ClientPasswordStrategy.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          clientId: string,
          clientSecret: string | undefined,
          cb: (err: Error | null, client?: IAuthClient | false) => void,
        ) => {
          try {
            const client = await verifyFn(clientId, clientSecret);

            if (!client) {
              throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
            } else if (
              client.clientType !== ClientType.public &&
              !clientSecret
            ) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.ConfidentialClientSecretMissing,
              );
            } else if (
              client.clientType !== ClientType.public &&
              (!client.clientSecret || client.clientSecret !== clientSecret)
            ) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.ClientVerificationFailed,
              );
            } else {
              // do nothing
            }
            cb(null, client);
          } catch (err) {
            cb(err);
          }
        },
      );
    }
  }
}
