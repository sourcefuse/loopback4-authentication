import {
  Constructor,
  MetadataInspector,
  MethodDecoratorFactory,
} from '@loopback/context';

import {USER_AUTHENTICATION_METADATA_KEY} from '../keys';
import {AuthenticationMetadata} from '../types';

export function authenticate(strategyName: string, options?: Object) {
  return MethodDecoratorFactory.createDecorator<AuthenticationMetadata>(
    USER_AUTHENTICATION_METADATA_KEY,
    {
      strategy: strategyName,
      options: options || {},
    },
  );
}

export function getAuthenticateMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): AuthenticationMetadata | undefined {
  return MetadataInspector.getMethodMetadata<AuthenticationMetadata>(
    USER_AUTHENTICATION_METADATA_KEY,
    controllerClass.prototype,
    methodName,
  );
}
