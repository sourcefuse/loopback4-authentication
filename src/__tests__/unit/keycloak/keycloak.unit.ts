import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import {
  KeycloakStrategyFactory,
  KeycloakStrategyFactoryProvider,
} from '../../../strategies';
import {Keycloak} from '../../../strategies/keycloak-type';

describe('getting keyCloak-auth strategy with options', () => {
  it('should return strategy by passing options', async () => {
    const strategyVerifier: KeycloakStrategyFactory = await getStrategy();

    const options: Keycloak.StrategyOptions = {
      host: 'string',
      realm: 'string',
      clientID: 'string',
      clientSecret: 'string',
      callbackURL: 'string',
      authorizationURL: 'string',
      tokenURL: 'string',
      userInfoURL: 'string',
    };

    const keyCloakAuthStrategyVerifier = strategyVerifier(options);

    expect(keyCloakAuthStrategyVerifier).to.have.property('name');
    expect(keyCloakAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new KeycloakStrategyFactoryProvider(verifierKeycloak);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierKeycloak(
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
