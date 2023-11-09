import {Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';

// eslint-disable-next-line @typescript-eslint/naming-convention
import * as SamlStrategy from '@node-saml/passport-saml';

import {VerifyFunction} from '../../types';

/**
 * A provider for default implementation of VerifyFunction.LocalPasswordFn
 *
 * It will just throw an error saying Not Implemented
 */
export class SamlVerifyProvider implements Provider<VerifyFunction.SamlFn> {
  constructor() {
    //This is intentional
  }

  value(): VerifyFunction.SamlFn {
    return async (
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
