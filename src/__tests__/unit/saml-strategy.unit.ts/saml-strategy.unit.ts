import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import * as SamlStrategy from '@node-saml/passport-saml';
import {
  SamlStrategyFactoryProvider,
  SamlStrategyFactory,
} from '../../../strategies/SAML';
import {SamlConfig} from '@node-saml/passport-saml';

describe('getting saml strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: SamlStrategyFactory = await getStrategy();

    const options: SamlConfig = {
      name: 'string',
      passReqToCallback: true,
      cert: 'string',
      issuer: 'string',
    };

    const SamlStrategyVerifier = strategyVerifier(options);

    expect(SamlStrategyVerifier).to.have.property('name');
    expect(SamlStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: SamlStrategyFactory = await getStrategy();

    const options: SamlConfig = {
      name: 'string',
      passReqToCallback: false,
      cert: 'string',
      issuer: 'string',
    };

    const SamlStrategyVerifier = strategyVerifier(options);

    expect(SamlStrategyVerifier).to.have.property('name');
    expect(SamlStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new SamlStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  profile: SamlStrategy.Profile,
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
