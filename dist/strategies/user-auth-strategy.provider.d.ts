import { Context, Provider } from '@loopback/core';
import { Strategy } from 'passport';
import { AuthenticationMetadata } from '../types';
import { BearerStrategyFactory } from './passport/passport-bearer';
import { GoogleAuthStrategyFactory } from './passport/passport-google-oauth2';
import { LocalPasswordStrategyFactory } from './passport/passport-local';
import { ResourceOwnerPasswordStrategyFactory } from './passport/passport-resource-owner-password';
import { AzureADAuthStrategyFactory } from './passport/passport-azure-ad';
import { AppleAuthStrategyFactory, InstagramAuthStrategyFactory, KeycloakStrategyFactory, FacebookAuthStrategyFactory, PassportOtpStrategyFactory } from './passport';
export declare class AuthStrategyProvider implements Provider<Strategy | undefined> {
    private readonly metadata;
    private readonly getLocalStrategyVerifier;
    private readonly getOtpVerifier;
    private readonly getBearerStrategyVerifier;
    private readonly getResourceOwnerVerifier;
    private readonly getGoogleAuthVerifier;
    private readonly getAzureADAuthVerifier;
    private readonly getKeycloakVerifier;
    private readonly ctx;
    private readonly getInstagramAuthVerifier;
    private readonly getFacebookAuthVerifier;
    private readonly getAppleAuthVerifier;
    constructor(metadata: AuthenticationMetadata, getLocalStrategyVerifier: LocalPasswordStrategyFactory, getOtpVerifier: PassportOtpStrategyFactory, getBearerStrategyVerifier: BearerStrategyFactory, getResourceOwnerVerifier: ResourceOwnerPasswordStrategyFactory, getGoogleAuthVerifier: GoogleAuthStrategyFactory, getAzureADAuthVerifier: AzureADAuthStrategyFactory, getKeycloakVerifier: KeycloakStrategyFactory, ctx: Context, getInstagramAuthVerifier: InstagramAuthStrategyFactory, getFacebookAuthVerifier: FacebookAuthStrategyFactory, getAppleAuthVerifier: AppleAuthStrategyFactory);
    value(): Promise<Strategy | undefined>;
}
