import {IAuthUser} from '../../../types';
import {expect} from '@loopback/testlab';
import {
  IProfile,
  IOIDCStrategyOptionWithRequest,
  IOIDCStrategyOptionWithoutRequest,
} from 'passport-azure-ad';
import {
  AzureADAuthStrategyFactoryProvider,
  AzureADAuthStrategyFactory,
} from '../../../strategies/passport/passport-azure-ad';

describe('getting azuread auth strategy with options', () => {
  it('should return strategy by passing options and passReqToCallback as true', async () => {
    const strategyVerifier: AzureADAuthStrategyFactory = await getStrategy();

    const options:
      | IOIDCStrategyOptionWithoutRequest
      | IOIDCStrategyOptionWithRequest = {
      scope: '',
      responseType: 'code',
      responseMode: 'query',
      redirectUrl: 'https://www.example.com',
      clientID: 'string',
      clientSecret: 'string',
      identityMetadata:
        'https://login.microsoftonline.com/your_tenant_name.onmicrosoft.com/.well-known/openid-configuration',
      passReqToCallback: true,
    };

    const azureAdAuthStrategyVerifier = strategyVerifier(options);

    expect(azureAdAuthStrategyVerifier).to.have.property('name');
    expect(azureAdAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });

  it('should return strategy by passing options and passReqToCallback as false', async () => {
    const strategyVerifier: AzureADAuthStrategyFactory = await getStrategy();

    const options:
      | IOIDCStrategyOptionWithoutRequest
      | IOIDCStrategyOptionWithRequest = {
      scope: '',
      responseType: 'code',
      responseMode: 'query',
      redirectUrl: 'https://www.example.com',
      clientID: 'string',
      clientSecret: 'string',
      identityMetadata:
        'https://login.microsoftonline.com/your_tenant_name.onmicrosoft.com/.well-known/openid-configuration',
      passReqToCallback: false,
    };

    const azureAdAuthStrategyVerifier = strategyVerifier(options);

    expect(azureAdAuthStrategyVerifier).to.have.property('name');
    expect(azureAdAuthStrategyVerifier)
      .to.have.property('authenticate')
      .which.is.a.Function();
  });
});

async function getStrategy() {
  const provider = new AzureADAuthStrategyFactoryProvider(verifierBearer);

  //this fuction will return a function which will then accept options.
  return provider.value();
}

//returning a user
function verifierBearer(
  accessToken: string,
  refreshToken: string,
  profile: IProfile,
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
