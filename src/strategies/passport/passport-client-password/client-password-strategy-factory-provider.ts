import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import * as ClientPasswordStrategy from 'passport-oauth2-client-password';

import {AuthErrorKeys} from '../../../error-keys';
import {IAuthClient} from '../../../types';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

export interface ClientPasswordStrategyFactory {
  (
    options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface,
  ): ClientPasswordStrategy.Strategy;
}

export class ClientPasswordStrategyFactoryProvider
  implements Provider<ClientPasswordStrategyFactory> {
  constructor(
    @inject(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
    private readonly verifier: VerifyFunction.OauthClientPasswordFn,
  ) {}

  value(): ClientPasswordStrategyFactory {
    return (options) => this.getClientPasswordVerifier(options);
  }

  getClientPasswordVerifier(
    options?: ClientPasswordStrategy.StrategyOptionsWithRequestInterface,
  ): ClientPasswordStrategy.Strategy {
    if (options?.passReqToCallback) {
      return new ClientPasswordStrategy.Strategy(
        options,

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          req: Request,
          clientId: string,
          clientSecret: string,
          cb: (err: Error | null, client?: IAuthClient | false) => void,
        ) => {
          try {
            const client = await this.verifier(clientId, clientSecret, req);
            if (!client) {
              throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
            } else if (
              !client.clientSecret ||
              client.clientSecret !== clientSecret
            ) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.ClientVerificationFailed,
              );
            }
            cb(null, client);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else {
      return new ClientPasswordStrategy.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          clientId: string,
          clientSecret: string,
          cb: (err: Error | null, client?: IAuthClient | false) => void,
        ) => {
          try {
            const client = await this.verifier(clientId, clientSecret);
            if (!client) {
              throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
            } else if (
              !client.clientSecret ||
              client.clientSecret !== clientSecret
            ) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.ClientVerificationFailed,
              );
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
