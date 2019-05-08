import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {Strategy} from 'passport';
import {
  Strategy as ClientPasswordStrategy,
  StrategyOptionsWithRequestInterface,
} from 'passport-oauth2-client-password';

import {AuthErrorKeys} from '../error-keys';
import {AuthenticationBindings} from '../keys';
import {STRATEGY} from '../strategy-name.enum';
import {IAuthClient, VerifyFunction, AuthenticationMetadata} from '../types';

export class ClientAuthStrategyProvider
  implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.CLIENT_METADATA)
    private readonly clientMetadata: AuthenticationMetadata,
    @inject(AuthenticationBindings.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
    private readonly verifier: VerifyFunction.OauthClientPasswordFn,
  ) {}

  value(): ValueOrPromise<Strategy | undefined> {
    if (!this.clientMetadata) {
      return undefined;
    }

    const name = this.clientMetadata.strategy;
    if (name === STRATEGY.CLIENT_PASSWORD) {
      return this.getClientPasswordVerifier(this.clientMetadata
        .options as StrategyOptionsWithRequestInterface);
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  getClientPasswordVerifier(
    options?: StrategyOptionsWithRequestInterface,
  ): ClientPasswordStrategy {
    if (options) {
      return new ClientPasswordStrategy(
        options as StrategyOptionsWithRequestInterface,
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
            return cb(null, client);
          } catch (err) {
            return cb(err);
          }
        },
      );
    } else {
      return new ClientPasswordStrategy(
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
            return cb(null, client);
          } catch (err) {
            return cb(err);
          }
        },
      );
    }
  }
}
