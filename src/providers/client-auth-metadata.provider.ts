import {Constructor, inject, Provider} from '@loopback/context';
import {CoreBindings} from '@loopback/core';

import {getClientAuthenticateMetadata} from '../decorators';
import {AuthenticationMetadata} from '../types';

export class ClientAuthMetadataProvider
  implements Provider<AuthenticationMetadata | undefined> {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS)
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME)
    private readonly methodName: string,
  ) {}

  value(): AuthenticationMetadata | undefined {
    return getClientAuthenticateMetadata(this.controllerClass, this.methodName);
  }
}
