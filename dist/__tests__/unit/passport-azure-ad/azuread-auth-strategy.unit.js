"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const passport_azure_ad_1 = require("../../../strategies/passport/passport-azure-ad");
describe('getting azuread auth strategy with options', () => {
    it('should return strategy by passing options and passReqToCallback as true', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            scope: '',
            responseType: 'code',
            responseMode: 'query',
            redirectUrl: 'https://www.example.com',
            clientID: 'string',
            clientSecret: 'string',
            identityMetadata: 'https://login.microsoftonline.com/your_tenant_name.onmicrosoft.com/.well-known/openid-configuration',
            passReqToCallback: true,
        };
        const azureAdAuthStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(azureAdAuthStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(azureAdAuthStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by passing options and passReqToCallback as false', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            scope: '',
            responseType: 'code',
            responseMode: 'query',
            redirectUrl: 'https://www.example.com',
            clientID: 'string',
            clientSecret: 'string',
            identityMetadata: 'https://login.microsoftonline.com/your_tenant_name.onmicrosoft.com/.well-known/openid-configuration',
            passReqToCallback: false,
        };
        const azureAdAuthStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(azureAdAuthStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(azureAdAuthStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new passport_azure_ad_1.AzureADAuthStrategyFactoryProvider(verifierBearer);
    //this fuction will return a function which will then accept options.
    return provider.value();
}
//returning a user
function verifierBearer(profile) {
    const userToPass = {
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
//# sourceMappingURL=azuread-auth-strategy.unit.js.map