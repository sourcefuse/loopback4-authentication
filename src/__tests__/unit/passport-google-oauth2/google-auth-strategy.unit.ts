import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import * as GoogleStrategy from 'passport-google-oauth20';
import {
  GoogleAuthStrategyFactoryProvider,
  GoogleAuthStrategyFactory,
} from '../../../strategies/passport/passport-google-oauth2';

describe('getting google-auth strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: GoogleAuthStrategyFactory = await getStrategy();

    const options:
      | GoogleStrategy.StrategyOptions
      | GoogleStrategy.StrategyOptionsWithRequest = {
      scope: '',
      clientID: 'string',
      clientSecret: 'string',
      passReqToCallback: true,
    };

    const googleAuthStrategyVerifier = strategyVerifier(options);

    expect(googleAuthStrategyVerifier).to.have.property('name');
    expect(googleAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: GoogleAuthStrategyFactory = await getStrategy();

    const options:
      | GoogleStrategy.StrategyOptions
      | GoogleStrategy.StrategyOptionsWithRequest = {
      scope: '',
      clientID: 'string',
      clientSecret: 'string',
      passReqToCallback: false,
    };

    const googleAuthStrategyVerifier = strategyVerifier(options);

    expect(googleAuthStrategyVerifier).to.have.property('name');
    expect(googleAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new GoogleAuthStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  accessToken: string,
  refreshToken: string,
  profile: GoogleStrategy.Profile,
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
