import {IAuthUser, IAuthClient} from '../../../types';
import {expect} from '@loopback/testlab';
import {
  ResourceOwnerPasswordStrategyFactoryProvider,
  ResourceOwnerPasswordStrategyFactory,
  Oauth2ResourceOwnerPassword,
} from '../../../strategies';
import {Request} from '@loopback/rest';

describe('getting resource-owner strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: ResourceOwnerPasswordStrategyFactory =
      await getStrategy();

    const options: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface =
      {
        passReqToCallback: true,
      };

    const resourceOwnerStrategyVerifier = strategyVerifier(options);

    expect(resourceOwnerStrategyVerifier).to.have.property('name');
    expect(resourceOwnerStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: ResourceOwnerPasswordStrategyFactory =
      await getStrategy();

    const options: Oauth2ResourceOwnerPassword.StrategyOptionsWithRequestInterface =
      {
        passReqToCallback: false,
      };

    const resourceOwnerStrategyVerifier = strategyVerifier(options);

    expect(resourceOwnerStrategyVerifier).to.have.property('name');
    expect(resourceOwnerStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by not passing any options', async () => {
    const strategyVerifier: ResourceOwnerPasswordStrategyFactory =
      await getStrategy();

    const resourceOwnerStrategyVerifier = strategyVerifier();

    expect(resourceOwnerStrategyVerifier).to.have.property('name');
    expect(resourceOwnerStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new ResourceOwnerPasswordStrategyFactoryProvider(
    verifierResourceOwner,
  );

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierResourceOwner(
  clientId: string,
  clientSecret: string,
  username: string,
  password: string,
  req?: Request,
): Promise<{client: IAuthClient; user: IAuthUser} | null> {
  const userToPass: IAuthUser = {
    id: 1,
    username: 'xyz',
    password: 'pass',
  };

  const clientToPass: IAuthClient = {
    clientId: 'id',
    clientSecret: 'secret',
    clientType: 'public',
  };

  return new Promise(function (resolve, reject) {
    if (userToPass) {
      resolve({user: userToPass, client: clientToPass});
    }
  });
}
