"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const strategies_1 = require("../../../strategies");
describe('getting apple-auth strategy with options', () => {
    it('should return strategy by passing options and passReqToCallback as true', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            scope: '',
            teamID: '',
            keyID: '',
            clientID: 'string',
            clientSecret: 'string',
            passReqToCallback: true,
        };
        const appleAuthStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(appleAuthStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(appleAuthStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by passing options and passReqToCallback as false', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            scope: '',
            teamID: '',
            keyID: '',
            clientID: 'string',
            clientSecret: 'string',
            passReqToCallback: true,
        };
        const appleAuthStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(appleAuthStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(appleAuthStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new strategies_1.AppleAuthStrategyFactoryProvider(verifierBearer);
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
//# sourceMappingURL=apple-auth-strategy.unit.js.map