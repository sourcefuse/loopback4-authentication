import {expect, sinon} from '@loopback/testlab';
import {
  KeycloakStrategyFactory,
  KeycloakStrategyFactoryProvider,
} from '../../../strategies/passport/passport-keycloak';
import {IAuthUser, Keycloak} from '../../../types';
import {AnyObject} from '@loopback/repository';

describe('Keycloak userProfileFn', () => {
  it('should successfully resolve', async () => {
    const strategyVerifier: KeycloakStrategyFactory = await getStrategy();

    const options: Keycloak.StrategyOptions = {
      host: 'localhost',
      realm: '/',
      clientID: 'string',
      clientSecret: 'string',
      callbackURL: 'localhost',
      authorizationURL: 'localhost',
      tokenURL: 'localhost',
      userInfoURL: 'localhost',
    };

    const keycloakAuthStrategyVerifier = strategyVerifier(options);

    const profilePromise = new Promise((resolve, reject) => {
      keycloakAuthStrategyVerifier._oauth2 = {
        _useAuthorizationHeaderForGET: false,
        get: sinon.stub().callsFake((url, token, cb) => {
          cb(null, JSON.stringify({}));
        }),
      };
      keycloakAuthStrategyVerifier.userProfile(
        '',
        (err: AnyObject, res: AnyObject) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
    await expect(profilePromise).to.be.fulfilled();
  });
});

async function getStrategy() {
  const provider = new KeycloakStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  accessToken: string,
  refreshToken: string,
  profile: Keycloak.Profile,
): Promise<IAuthUser | null> {
  const userToPass: IAuthUser = {
    id: 1,
    username: 'xyz',
    password: 'pass',
  };

  return new Promise(function (resolve, reject) {
    if (userToPass) {
      resolve(userToPass);
    }
  });
}
