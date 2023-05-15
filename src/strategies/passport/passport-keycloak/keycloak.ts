import {HttpErrors} from '@loopback/rest';
import KeycloakConnect from 'keycloak-connect';
import {AnyObject} from '@loopback/repository';
import {KeycloakProfile} from 'keycloak-js';
import {AuthErrorKeys} from '../../../error-keys';
import {VerifyCallback} from '../../types';

type VerifyFunction = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  verified: VerifyCallback,
) => void;

export interface StrategyOptions {
  host: string;
  realm: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  authorizationURL: string;
  tokenURL: string;
  userInfoURL: string;
}

export declare type KecloackOptions = Partial<KeycloakConnect.KeycloakConfig> &
  StrategyOptions;

export interface Profile {
  keycloakId?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  avatar?: string;
  realm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class KeycloakStrategy {
  private readonly keycloak: KeycloakConnect.Keycloak;

  constructor(_options?: KecloackOptions, verify?: VerifyFunction) {
    this.name = 'keycloak';
    if (verify) {
      this.verify = verify;
    }
    this.keycloak = new KeycloakConnect(
      {},
      {
        realm: 'Keycloak',
        'auth-server-url': 'https://keycloak.your-domain.com/auth',
        'ssl-required': 'external',
        resource: 'your-client-id',
        'bearer-only': true,
        //'public-client': true,
        'confidential-port': 0,
      },
    );
  }
  name: string;
  private readonly verify: VerifyFunction;

  async authenticate(request: AnyObject): Promise<void> {
    const {headers} = request;
    const accessToken = headers?.authorization?.split('Bearer ')[1];

    if (!accessToken) {
      throw new HttpErrors.Unauthorized('Missing authorization token');
    }
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const decodedToken = await this.keycloak.grantManager.validateAccessToken(
      accessToken,
    );
    const granted = await this.keycloak.grantManager.createGrant({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      access_token: accessToken,
    });

    const user = await this.getUserById(decodedToken);
    if (!user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.UserNotFound);
    }
    const userProfile: Profile = {
      keycloakId: user.id,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
    const verified = (err?: any, user?: any, _info?: any) => {
      if (err) {
        throw new Error(`Error: ${err}`);
      }
      if (!user) {
        throw new Error(`UserNotFound`);
      }
      return user;
    };
    this.verify(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      granted.access_token as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      granted.refresh_token as any,
      userProfile,
      verified,
    );
  }
  async getUserById(userId: string): Promise<KeycloakProfile | undefined> {
    try {
      const user = await this.keycloak.grantManager.userInfo(userId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return user as any; //NOSONAR
    } catch (err) {
      console.error(`Error retrieving user with ID ${userId}:`, err);
      return undefined;
    }
  }
}
