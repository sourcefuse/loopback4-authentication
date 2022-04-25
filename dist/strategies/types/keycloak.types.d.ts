export declare namespace Keycloak {
    interface StrategyOptions {
        host: string;
        realm: string;
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        authorizationURL: string;
        tokenURL: string;
        userInfoURL: string;
    }
    interface Profile {
        keycloakId: string;
        fullName: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        avatar: string;
        realm: string;
        [key: string]: any;
    }
    type VerifyCallback = (err?: string | Error, user?: any, info?: any) => void;
}
