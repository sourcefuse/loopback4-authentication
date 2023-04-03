import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import * as ClientPasswordStrategy from './client-password-strategy';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthClient} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

export interface ClientPasswordStrategyFactory {
  (
    options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface,
    verifierPassed?: VerifyFunction.OauthClientPasswordFn,
  ): ClientPasswordStrategy.Strategy;
}

export class ClientPasswordStrategyFactoryProvider
  implements Provider<ClientPasswordStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
    private readonly verifier: VerifyFunction.OauthClientPasswordFn,
  ) {}

  value(): ClientPasswordStrategyFactory {
    return (options, verifier) =>
      this.getClientPasswordVerifier(options, verifier);
  }

  clientPasswordVerifierHelper(
    client: IAuthClient | null,
    clientSecret: string | undefined,
  ) {
    if (!client) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    } else if (!client.clientSecret || client.clientSecret !== clientSecret) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientVerificationFailed);
    } else {
      // do nothing
    }
  }

  getClientPasswordVerifier(
    options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface,
    verifierPassed?: VerifyFunction.OauthClientPasswordFn,
  ): ClientPasswordStrategy.Strategy {
    const verifyFn = verifierPassed ?? this.verifier;
    if (options?.passReqToCallback) {
      return new ClientPasswordStrategy.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          clientId: string,
          clientSecret: string | undefined,
          cb: (err: Error | null, client?: IAuthClient | null) => void,
          req: Request | undefined,
        ) => {
          try {
            const client = await verifyFn(clientId, clientSecret, req);
            this.clientPasswordVerifierHelper(client, clientSecret);
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
          cb: (err: Error | null, client?: IAuthClient | null) => void,
        ) => {
          try {
            const client = await verifyFn(clientId, clientSecret);
            this.clientPasswordVerifierHelper(client, clientSecret);
            cb(null, client);
          } catch (err) {
            cb(err);
          }
        },
      );
    }
  }
}
