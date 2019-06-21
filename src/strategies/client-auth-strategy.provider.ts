import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {Strategy} from 'passport';
import {StrategyOptionsWithRequestInterface} from 'passport-oauth2-client-password';

import {AuthenticationBindings} from '../keys';
import {STRATEGY} from '../strategy-name.enum';
import {AuthenticationMetadata} from '../types';
import {Strategies} from './keys';
import {ClientPasswordStrategyFactory} from './passport/passport-client-password';

export class ClientAuthStrategyProvider
  implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.CLIENT_METADATA)
    private readonly clientMetadata: AuthenticationMetadata,
    @inject(Strategies.Passport.CLIENT_PASSWORD_STRATEGY_FACTORY)
    private readonly getClientPasswordVerifier: ClientPasswordStrategyFactory,
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
}
