"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategies_1 = require("../../../strategies");
const testlab_1 = require("@loopback/testlab");
/**
 * Testing to get bearer strategy from providers
 */
describe('getting bearer token strategy with options', () => {
    it('should return strategy by passing options and passReqToCallback as true', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            scope: '',
            realm: '',
            passReqToCallback: true,
        };
        const bearerStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(bearerStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(bearerStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by passing options and passReqToCallback as false', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            scope: '',
            realm: '',
            passReqToCallback: false,
        };
        const bearerStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(bearerStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(bearerStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy without options', async () => {
        const strategyVerifier = await getStrategy();
        const bearerStrategyVerifier = strategyVerifier();
        (0, testlab_1.expect)(bearerStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(bearerStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new strategies_1.BearerStrategyFactoryProvider(verifierBearer);
    //this fuction will return a function which will then accept options.
    return provider.value();
}
//returning a user
function verifierBearer(token) {
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
//# sourceMappingURL=bearer-token-verify.unit.js.map