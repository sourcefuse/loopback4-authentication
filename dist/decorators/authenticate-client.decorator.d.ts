import { Constructor } from '@loopback/context';
import { AuthenticationMetadata } from '../types';
export declare function authenticateClient(strategyName: string, options?: Object): MethodDecorator;
export declare function getClientAuthenticateMetadata(controllerClass: Constructor<{}>, methodName: string): AuthenticationMetadata | undefined;
