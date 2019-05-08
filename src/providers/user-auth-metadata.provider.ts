import {Constructor, inject, Provider} from '@loopback/context';
import {CoreBindings} from '@loopback/core';

import {getAuthenticateMetadata} from '../decorators';
import {AuthenticationMetadata} from '../types';

export class AuthMetadataProvider
  implements Provider<AuthenticationMetadata | undefined> {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS)
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME)
    private readonly methodName: string,
  ) {}

  value(): AuthenticationMetadata | undefined {
    return getAuthenticateMetadata(this.controllerClass, this.methodName);
  }
}
