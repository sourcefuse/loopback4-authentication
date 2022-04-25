import { Constructor, Provider } from '@loopback/context';
import { AuthenticationMetadata } from '../types';
export declare class ClientAuthMetadataProvider implements Provider<AuthenticationMetadata | undefined> {
    private readonly controllerClass;
    private readonly methodName;
    constructor(controllerClass: Constructor<{}>, methodName: string);
    value(): AuthenticationMetadata | undefined;
}
