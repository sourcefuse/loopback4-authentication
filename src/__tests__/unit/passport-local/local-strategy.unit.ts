import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import {
  LocalPasswordStrategyFactoryProvider,
  LocalPasswordStrategyFactory,
} from '../../../strategies';
import {Request} from '@loopback/rest';
import * as PassportLocal from 'passport-local';

describe('getting local strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: LocalPasswordStrategyFactory = await getStrategy();

    const options:
      | PassportLocal.IStrategyOptions
      | PassportLocal.IStrategyOptionsWithRequest = {
      passReqToCallback: true,
    };

    const localStrategyVerifier = strategyVerifier(options);

    expect(localStrategyVerifier).to.have.property('name');
    expect(localStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: LocalPasswordStrategyFactory = await getStrategy();

    const options:
      | PassportLocal.IStrategyOptions
      | PassportLocal.IStrategyOptionsWithRequest = {
      passReqToCallback: false,
    };

    const localStrategyVerifier = strategyVerifier(options);

    expect(localStrategyVerifier).to.have.property('name');
    expect(localStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by not passing any options', async () => {
    const strategyVerifier: LocalPasswordStrategyFactory = await getStrategy();

    const localStrategyVerifier = strategyVerifier();

    expect(localStrategyVerifier).to.have.property('name');
    expect(localStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new LocalPasswordStrategyFactoryProvider(verifierLocal);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierLocal(
  username: string,
  password: string,
  req?: Request,
): Promise<IAuthUser | null> {
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
