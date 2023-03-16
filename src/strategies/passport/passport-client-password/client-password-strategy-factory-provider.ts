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
  getClientPasswordVerifier1(verifyFn: VerifyFunction.OauthClientPasswordFn) {
    return async (
      req: Request,
      clientId: string,
      clientSecret: string,
      cb: (err: Error | null, client?: IAuthClient | false) => void,
    ) => {
      try {
        const client = await verifyFn(clientId, clientSecret, req);
        if (!client) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
        } else if (
          !client.clientSecret ||
          client.clientSecret !== clientSecret
        ) {
          throw new HttpErrors.Unauthorized(
            AuthErrorKeys.ClientVerificationFailed,
          );
        } else {
          //this is intentional
        }
        cb(null, client);
      } catch (err) {
        cb(err);
      }
    };
  }
  getClientPasswordVerifier2(verifyFn: VerifyFunction.OauthClientPasswordFn) {
    return async (
      clientId: string,
      clientSecret: string,
      cb: (err: Error | null, client?: IAuthClient | false) => void,
    ) => {
      try {
        const client = await verifyFn(clientId, clientSecret);
        if (!client) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
        } else if (
          !client.clientSecret ||
          client.clientSecret !== clientSecret
        ) {
          throw new HttpErrors.Unauthorized(
            AuthErrorKeys.ClientVerificationFailed,
          );
        } else {
          //this is intentional
        }
        cb(null, client);
      } catch (err) {
        cb(err);
      }
    };
  }
  clientPasswordVerifierHelper(
    client: IAuthClient | null,
    clientSecret: string | undefined,
  ) {
    if (!client?.clientSecret || client.clientSecret !== clientSecret) {
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
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.getClientPasswordVerifier1(verifyFn),
      );
    } else {
      return new ClientPasswordStrategy.Strategy(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.getClientPasswordVerifier2(verifyFn),
      );
    }
  }
}
