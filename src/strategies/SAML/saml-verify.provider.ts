import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';

import * as SamlStrategy from 'passport-saml';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class SamlVerifyProvider implements Provider<VerifyFunction.SamlFn> {
  constructor() {}

  value(): VerifyFunction.SamlFn {
    return async (
      // accessToken: string,
      // refreshToken: string,
      profile: SamlStrategy.Profile,
      cb: SamlStrategy.VerifiedCallback,
      req?: Request,
    ) => {
      throw new HttpErrors.NotImplemented(
        `VerifyFunction.SamlFn is not implemented`,
      );
    };
  }
}
