import {IAuthUser, Keycloak} from '../../../types';
import {expect} from '@loopback/testlab';
import {
  KeycloakStrategyFactory,
  KeycloakStrategyFactoryProvider,
} from '../../../strategies/passport/passport-keycloak';

describe('getting keycloak-auth strategy with options', () => {
  it('should return strategy by passing required options', async () => {
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

    expect(keycloakAuthStrategyVerifier).to.have.property('name');
    expect(keycloakAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
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
