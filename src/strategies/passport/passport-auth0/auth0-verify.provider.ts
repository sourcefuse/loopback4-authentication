import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {VerifyFunction} from '../../../types';
import {Request} from '@loopback/express';
import {VerifyCallback} from './auth0-strategy-factory-provider';
import * as Auth0Strategy from 'passport-auth0';

export class Auth0VerifyProvider implements Provider<VerifyFunction.Auth0Fn> {
  value(): VerifyFunction.Auth0Fn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Auth0Strategy.Profile,
      cb: VerifyCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.Auth0Fn is not implemented`,
      );
    };
  }
}
