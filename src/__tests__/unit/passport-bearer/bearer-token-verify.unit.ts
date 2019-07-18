import {IAuthUser} from '../../../types';
import {
  BearerStrategyFactoryProvider,
  BearerStrategyFactory,
} from '../../../strategies';
import * as PassportBearer from 'passport-http-bearer';
import {expect} from '@loopback/testlab';

/**
 * Testing to get bearer strategy from providers
 */
describe('getting bearer token strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: BearerStrategyFactory = await getStrategy();

    const options: PassportBearer.IStrategyOptions = {
      scope: '',
      realm: '',
      passReqToCallback: true,
    };

    const bearerStrategyVerifier = strategyVerifier(options);

    expect(bearerStrategyVerifier).to.have.property('name');
    expect(bearerStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: BearerStrategyFactory = await getStrategy();

    const options: PassportBearer.IStrategyOptions = {
      scope: '',
      realm: '',
      passReqToCallback: false,
    };

    const bearerStrategyVerifier = strategyVerifier(options);

    expect(bearerStrategyVerifier).to.have.property('name');
    expect(bearerStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy without options', async () => {
    const strategyVerifier: BearerStrategyFactory = await getStrategy();

    const bearerStrategyVerifier = strategyVerifier();

    expect(bearerStrategyVerifier).to.have.property('name');
    expect(bearerStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new BearerStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(token: string): Promise<IAuthUser> {
  const userToPass: IAuthUser = {
    id: 1,
    username: 'xyz',
    password: 'pass',
  };

  return new Promise(function(resolve, reject) {
    if (userToPass) {
      resolve(userToPass);
    }
  });
}
