import {IAuthClient} from '../../../types';
import {
  ClientPasswordStrategyFactoryProvider,
  ClientPasswordStrategyFactory,
} from '../../../strategies';
import {expect} from '@loopback/testlab';

/**
 * Testing to get bearer strategy from providers
 */
describe('getting client-password strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: ClientPasswordStrategyFactory = await getStrategy();

    const options = {
      scope: '',
      realm: '',
      passReqToCallback: true,
    };

    const clientPasswordStrategyVerifier = strategyVerifier(options);

    expect(clientPasswordStrategyVerifier).to.have.property('name');
    expect(clientPasswordStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: ClientPasswordStrategyFactory = await getStrategy();

    const options = {
      scope: '',
      realm: '',
      passReqToCallback: false,
    };

    const clientPasswordStrategyVerifier = strategyVerifier(options);

    expect(clientPasswordStrategyVerifier).to.have.property('name');
    expect(clientPasswordStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy without options', async () => {
    const strategyVerifier: ClientPasswordStrategyFactory = await getStrategy();

    const clientPasswordStrategyVerifier = strategyVerifier();

    expect(clientPasswordStrategyVerifier).to.have.property('name');
    expect(clientPasswordStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new ClientPasswordStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  clientId: string,
  clientSecret: string,
): Promise<IAuthClient> {
  const clientToPass: IAuthClient = {
    clientId: clientId,
    clientSecret: clientSecret,
  };

  return new Promise(function (resolve, reject) {
    if (clientToPass) {
      resolve(clientToPass);
    }
  });
}
