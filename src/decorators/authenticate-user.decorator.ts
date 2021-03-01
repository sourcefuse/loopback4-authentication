import {
  BindingKey,
  Constructor,
  MetadataInspector,
  MethodDecoratorFactory,
} from '@loopback/context';
import {Request} from '@loopback/rest';

import {USER_AUTHENTICATION_METADATA_KEY} from '../keys';
import {VerifyFunction} from '../strategies';
import {AuthenticationMetadata} from '../types';

/**
 * `@authenticate` decorator for adding authentication to controller methods
 *
 * @param strategyName  Name of the Strategy. Use Strategy enum
 * like `Strategy.LOCAL`
 * @param options       Extra options to be passed on
 * while instantiating strategy specific class
 * @param verifier    Binding key for a custom verifier
 * @param authOptions   Extra options to be passed on to `authenticate` method
 * of the strategy.
 * This is a creator function which should return an object with options.
 * The request object is passed on as parameter to the method.
 * It can be used to setup `state` parameters based on request for google-auth,
 * for example.
 */
export function authenticate(
  strategyName: string,
  options?: Object,
  verifier?: BindingKey<VerifyFunction.GenericAuthFn>,
  authOptions?: (req: Request) => Object,
) {
  return MethodDecoratorFactory.createDecorator<AuthenticationMetadata>(
    USER_AUTHENTICATION_METADATA_KEY,
    {
      strategy: strategyName,
      options: options ?? {},
      verifier,
      authOptions: authOptions,
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
