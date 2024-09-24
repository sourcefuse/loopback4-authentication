import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import * as Auth0Strategy from 'passport-auth0';

import {
  Auth0StrategyOptions,
  Auth0StrategyFactoryProvider,
  Auth0StrategyFactory,
} from '../../../strategies/passport/passport-auth0';

describe('getting auth0 strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: Auth0StrategyFactory = await getStrategy();

    const options:
      | Auth0StrategyOptions
      | Auth0Strategy.StrategyOptionWithRequest = {
      clientID: 'string',
      clientSecret: 'string',
      callbackURL: 'string',
      domain: 'string',
      passReqToCallback: true,
    };

    const auth0StrategyVerifier = strategyVerifier(options);

    expect(auth0StrategyVerifier).to.have.property('name');
    expect(auth0StrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: Auth0StrategyFactory = await getStrategy();

    const options:
      | Auth0StrategyOptions
      | Auth0Strategy.StrategyOptionWithRequest = {
      clientID: 'string',
      clientSecret: 'string',
      callbackURL: 'string',
      domain: 'string',
      passReqToCallback: false,
    };

    const auth0StrategyVerifier = strategyVerifier(options);

    expect(auth0StrategyVerifier).to.have.property('name');
    expect(auth0StrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new Auth0StrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  accessToken: string,
  refreshToken: string,
  profile: Auth0Strategy.Profile,
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
