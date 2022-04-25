"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const strategies_1 = require("../../../strategies");
describe('getting keycloak-auth strategy with options', () => {
    it('should return strategy by passing required options', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            host: 'localhost',
            realm: '/',
            clientID: 'string',
            clientSecret: 'string',
            callbackURL: 'localhost',
            authorizationURL: 'localhost',
            tokenURL: 'localhost',
            userInfoURL: 'localhost',
        };
        const keycloakAuthStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(keycloakAuthStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(keycloakAuthStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new strategies_1.KeycloakStrategyFactoryProvider(verifierBearer);
    //this fuction will return a function which will then accept options.
    return provider.value();
}
//returning a user
function verifierBearer(accessToken, refreshToken, profile) {
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
//# sourceMappingURL=keycloak-auth-strategy.unit.js.map