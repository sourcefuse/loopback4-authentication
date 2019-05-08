import {
  Constructor,
  MetadataInspector,
  MethodDecoratorFactory,
} from '@loopback/context';

import {CLIENT_AUTHENTICATION_METADATA_KEY} from '../keys';
import {AuthenticationMetadata} from '../types';

export function authenticateClient(strategyName: string, options?: Object) {
  return MethodDecoratorFactory.createDecorator<AuthenticationMetadata>(
    CLIENT_AUTHENTICATION_METADATA_KEY,
    {
      strategy: strategyName,
      options: options || {},
    },
  );
}

export function getClientAuthenticateMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): AuthenticationMetadata | undefined {
  return MetadataInspector.getMethodMetadata<AuthenticationMetadata>(
    CLIENT_AUTHENTICATION_METADATA_KEY,
    controllerClass.prototype,
    methodName,
  );
}
