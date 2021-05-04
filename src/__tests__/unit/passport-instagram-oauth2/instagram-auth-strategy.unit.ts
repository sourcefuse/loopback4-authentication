import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import * as InstagramStrategy from 'passport-instagram';
import {
  InstagramAuthStrategyFactoryProvider,
  InstagramAuthStrategyFactory,
} from '../../../strategies/passport/passport-insta-oauth2';

describe('getting instagram-auth strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: InstagramAuthStrategyFactory = await getStrategy();

    const options:
      | InstagramStrategy.StrategyOption
      | InstagramStrategy.StrategyOptionWithRequest = {
      callbackURL: '',
      clientID: 'string',
      clientSecret: 'string',
      passReqToCallback: true,
    };

    const instagramAuthStrategyVerifier = strategyVerifier(options);

    expect(instagramAuthStrategyVerifier).to.have.property('name');
    expect(instagramAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: InstagramAuthStrategyFactory = await getStrategy();

    const options:
      | InstagramStrategy.StrategyOption
      | InstagramStrategy.StrategyOptionWithRequest = {
      callbackURL: '',
      clientID: 'string',
      clientSecret: 'string',
      passReqToCallback: false,
    };

    const instagramAuthStrategyVerifier = strategyVerifier(options);

    expect(instagramAuthStrategyVerifier).to.have.property('name');
    expect(instagramAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new InstagramAuthStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  accessToken: string,
  refreshToken: string,
  profile: InstagramStrategy.Profile,
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
