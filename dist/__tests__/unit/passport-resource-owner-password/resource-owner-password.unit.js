"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const strategies_1 = require("../../../strategies");
describe('getting resource-owner strategy with options', () => {
    it('should return strategy by passing options and passReqToCallback as true', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            passReqToCallback: true,
        };
        const resourceOwnerStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(resourceOwnerStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(resourceOwnerStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by passing options and passReqToCallback as false', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            passReqToCallback: false,
        };
        const resourceOwnerStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(resourceOwnerStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(resourceOwnerStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by not passing any options', async () => {
        const strategyVerifier = await getStrategy();
        const resourceOwnerStrategyVerifier = strategyVerifier();
        (0, testlab_1.expect)(resourceOwnerStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(resourceOwnerStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new strategies_1.ResourceOwnerPasswordStrategyFactoryProvider(verifierResourceOwner);
    //this fuction will return a function which will then accept options.
    return provider.value();
}
//returning a user
function verifierResourceOwner(clientId, clientSecret, username, password, req) {
    const userToPass = {
        id: 1,
        username: 'xyz',
        password: 'pass',
    };
    const clientToPass = {
        clientId: 'id',
        clientSecret: 'secret',
    };
    return new Promise(function (resolve, reject) {
        if (userToPass) {
            resolve({ user: userToPass, client: clientToPass });
        }
    });
}
//# sourceMappingURL=resource-owner-password.unit.js.map