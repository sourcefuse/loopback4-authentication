import {Cognito, IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import {
  CognitoStrategyFactoryProvider,
  CognitoAuthStrategyFactory,
} from '../../../strategies/passport/passport-cognito-oauth2';

describe('getting cognito-auth strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: CognitoAuthStrategyFactory = await getStrategy();

    const options: Cognito.StrategyOptions = {
      callbackURL: 'string',
      clientDomain: 'string',
      clientID: 'string',
      clientSecret: 'string',
      region: 'string',
      passReqToCallback: true,
    };

    const cognitoAuthStrategyVerifier = strategyVerifier(options);

    expect(cognitoAuthStrategyVerifier).to.have.property('name');
    expect(cognitoAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: CognitoAuthStrategyFactory = await getStrategy();

    const options: Cognito.StrategyOptions = {
      callbackURL: 'string',
      clientDomain: 'string',
      clientID: 'string',
      clientSecret: 'string',
      region: 'string',
      passReqToCallback: false,
    };

    const cognitoAuthStrategyVerifier = strategyVerifier(options);

    expect(cognitoAuthStrategyVerifier).to.have.property('name');
    expect(cognitoAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new CognitoStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  accessToken: string,
  refreshToken: string,
  profile: Cognito.Profile,
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
