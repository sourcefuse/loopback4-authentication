import {BindingKey} from '@loopback/context';
import {MetadataAccessor} from '@loopback/metadata';
import {Strategy} from 'passport';

import {
  AuthenticateFn,
  AuthenticationConfig,
  AuthenticationMetadata,
  IAuthClient,
  IAuthUser,
} from './types';

export * from './strategies/keys';

/**
 * Binding keys used by this component.
 */
export namespace AuthenticationBindings {
  export const USER_STRATEGY = BindingKey.create<Strategy | undefined>(
    'sf.userAuthentication.strategy',
  );

  export const CLIENT_STRATEGY = BindingKey.create<Strategy | undefined>(
    'sf.clientAuthentication.strategy',
  );

  export const USER_AUTH_ACTION = BindingKey.create<
    AuthenticateFn<IAuthUser | undefined>
  >('sf.userAuthentication.actions.authenticate');

  export const CLIENT_AUTH_ACTION = BindingKey.create<
    AuthenticateFn<IAuthClient | undefined>
  >('sf.clientAuthentication.actions.authenticate');

  export const USER_METADATA = BindingKey.create<
    AuthenticationMetadata | undefined
  >('sf.userAuthentication.operationMetadata');

  export const CLIENT_METADATA = BindingKey.create<
    AuthenticationMetadata | undefined
  >('sf.clientAuthentication.operationMetadata');

  export const CURRENT_USER = BindingKey.create<IAuthUser | undefined>(
    'sf.userAuthentication.currentUser',
  );

  export const CURRENT_CLIENT = BindingKey.create<IAuthClient | undefined>(
    'sf.clientAuthentication.currentClient',
  );

  export const CONFIG = BindingKey.create<AuthenticationConfig>(
    'sf.userAuthentication.config',
  );
}

export const USER_AUTHENTICATION_METADATA_KEY = MetadataAccessor.create<
  AuthenticationMetadata,
  MethodDecorator
>('userAuthentication.operationsMetadata');

export const CLIENT_AUTHENTICATION_METADATA_KEY = MetadataAccessor.create<
  AuthenticationMetadata,
  MethodDecorator
>('clientAuthentication.operationsMetadata');
