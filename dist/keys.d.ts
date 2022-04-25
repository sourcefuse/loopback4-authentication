import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { Strategy } from 'passport';
import { AuthenticateFn, AuthenticationMetadata, IAuthClient, IAuthUser } from './types';
export * from './strategies/keys';
/**
 * Binding keys used by this component.
 */
export declare namespace AuthenticationBindings {
    const USER_STRATEGY: BindingKey<Strategy | undefined>;
    const CLIENT_STRATEGY: BindingKey<Strategy | undefined>;
    const USER_AUTH_ACTION: BindingKey<AuthenticateFn<IAuthUser | undefined>>;
    const CLIENT_AUTH_ACTION: BindingKey<AuthenticateFn<IAuthClient | undefined>>;
    const USER_METADATA: BindingKey<AuthenticationMetadata<void> | undefined>;
    const CLIENT_METADATA: BindingKey<AuthenticationMetadata<void> | undefined>;
    const CURRENT_USER: BindingKey<IAuthUser | undefined>;
    const CURRENT_CLIENT: BindingKey<IAuthClient | undefined>;
}
export declare const USER_AUTHENTICATION_METADATA_KEY: MetadataAccessor<AuthenticationMetadata<void>, MethodDecorator>;
export declare const CLIENT_AUTHENTICATION_METADATA_KEY: MetadataAccessor<AuthenticationMetadata<void>, MethodDecorator>;
