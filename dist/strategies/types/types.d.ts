/// <reference types="passport" />
/// <reference types="express" />
import { Request } from '@loopback/rest';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as AzureADStrategy from 'passport-azure-ad';
import * as InstagramStrategy from 'passport-instagram';
import * as FacebookStrategy from 'passport-facebook';
import * as AppleStrategy from 'passport-apple';
import { DecodedIdToken } from 'passport-apple';
import { IAuthClient, IAuthUser } from '../../types';
import { Keycloak } from './keycloak.types';
import { Otp } from '../passport';
export declare type VerifyCallback = (err?: string | Error | null, user?: Express.User, info?: any) => void;
export declare namespace VerifyFunction {
    interface OauthClientPasswordFn<T = IAuthClient> extends GenericAuthFn<T> {
        (clientId: string, clientSecret: string, req?: Request): Promise<T | null>;
    }
    interface LocalPasswordFn<T = IAuthUser> extends GenericAuthFn<T> {
        (username: string, password: string, req?: Request): Promise<T | null>;
    }
    interface OtpAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
        (key: string, otp: string, cb: Otp.VerifyCallback): Promise<T | null>;
    }
    interface BearerFn<T = IAuthUser> extends GenericAuthFn<T> {
        (token: string, req?: Request): Promise<T | null>;
    }
    interface ResourceOwnerPasswordFn<T = IAuthClient, S = IAuthUser> {
        (clientId: string, clientSecret: string, username: string, password: string, req?: Request): Promise<{
            client: T;
            user: S;
        } | null>;
    }
    interface GoogleAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
        (accessToken: string, refreshToken: string, profile: GoogleStrategy.Profile, cb: GoogleStrategy.VerifyCallback, req?: Request): Promise<T | null>;
    }
    interface AzureADAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
        (profile: AzureADStrategy.IProfile, done: AzureADStrategy.VerifyCallback, req?: Request): Promise<T | null>;
    }
    interface KeycloakAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
        (accessToken: string, refreshToken: string, profile: Keycloak.Profile, cb: (err?: string | Error, user?: IAuthUser) => void): Promise<T | null>;
    }
    interface InstagramAuthFn<T = IAuthUser> extends VerifyFunction.GenericAuthFn<T> {
        (accessToken: string, refreshToken: string, profile: InstagramStrategy.Profile, cb: VerifyCallback, req?: Request): Promise<T | null>;
    }
    interface FacebookAuthFn<T = IAuthUser> extends VerifyFunction.GenericAuthFn<T> {
        (accessToken: string, refreshToken: string, profile: FacebookStrategy.Profile, cb: VerifyCallback, req?: Request): Promise<T | null>;
    }
    interface AppleAuthFn<T = IAuthUser> extends GenericAuthFn<T> {
        (accessToken: string, refreshToken: string, decodedIdToken: DecodedIdToken, profile: AppleStrategy.Profile, cb: AppleStrategy.VerifyCallback, req?: Request): Promise<T | null>;
    }
    interface GenericAuthFn<T = any> {
        (...params: any): Promise<T | null>;
    }
}
