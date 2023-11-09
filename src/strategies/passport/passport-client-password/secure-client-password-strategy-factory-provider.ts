import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as ClientPasswordStrategy from './client-password-strategy';

import {AuthErrorKeys} from '../../../error-keys';
import {ClientType, IAuthSecureClient} from '../../../types';
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

  secureClientPasswordVerifierHelper(
    client: IAuthSecureClient | null,
    clientSecret: string | undefined,
  ) {
    if (
      !client ||
      (client.clientType !== ClientType.public &&
        (!client.clientSecret || client.clientSecret !== clientSecret))
    ) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientVerificationFailed);
    } else {
      // do nothing
    }
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
          cb: (err: Error | null, client?: IAuthSecureClient | null) => void,
          req: Request | undefined,
        ) => {
          try {
            const client = await verifyFn(clientId, clientSecret, req);
            this.secureClientPasswordVerifierHelper(client, clientSecret);

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
          cb: (err: Error | null, client?: IAuthSecureClient | null) => void,
        ) => {
          try {
            const client = await verifyFn(clientId, clientSecret);

            this.secureClientPasswordVerifierHelper(client, clientSecret);

            cb(null, client);
          } catch (err) {
            cb(err);
          }
        },
      );
    }
  }
}
