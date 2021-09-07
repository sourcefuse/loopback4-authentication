import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import {
  AppleAuthStrategyFactory,
  AppleAuthStrategyFactoryProvider,
} from '../../../strategies';
import AppleStrategy, {
  AuthenticateOptions,
  AuthenticateOptionsWithRequest,
} from 'passport-apple';

describe('getting apple-auth strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: AppleAuthStrategyFactory = await getStrategy();

    const options: AuthenticateOptions | AuthenticateOptionsWithRequest = {
      scope: '',
      teamID: '',
      keyID: '',
      clientID: 'string',
      clientSecret: 'string',
      passReqToCallback: true,
    };

    const appleAuthStrategyVerifier = strategyVerifier(options);

    expect(appleAuthStrategyVerifier).to.have.property('name');
    expect(appleAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: AppleAuthStrategyFactory = await getStrategy();

    const options: AuthenticateOptions | AuthenticateOptionsWithRequest = {
      scope: '',
      teamID: '',
      keyID: '',
      clientID: 'string',
      clientSecret: 'string',
      passReqToCallback: true,
    };

    const appleAuthStrategyVerifier = strategyVerifier(options);

    expect(appleAuthStrategyVerifier).to.have.property('name');
    expect(appleAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new AppleAuthStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  accessToken: string,
  refreshToken: string,
  profile: AppleStrategy.Profile,
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
