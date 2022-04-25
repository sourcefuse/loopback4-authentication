"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategies_1 = require("../../../strategies");
const testlab_1 = require("@loopback/testlab");
/**
 * Testing to get bearer strategy from providers
 */
describe('getting client-password strategy with options', () => {
    it('should return strategy by passing options and passReqToCallback as true', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            scope: '',
            realm: '',
            passReqToCallback: true,
        };
        const clientPasswordStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(clientPasswordStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(clientPasswordStrategyVerifier)
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
        const clientPasswordStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(clientPasswordStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(clientPasswordStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy without options', async () => {
        const strategyVerifier = await getStrategy();
        const clientPasswordStrategyVerifier = strategyVerifier();
        (0, testlab_1.expect)(clientPasswordStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(clientPasswordStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new strategies_1.ClientPasswordStrategyFactoryProvider(verifierBearer);
    //this fuction will return a function which will then accept options.
    return provider.value();
}
//returning a user
function verifierBearer(clientId, clientSecret) {
    const clientToPass = {
        clientId: clientId,
        clientSecret: clientSecret,
    };
    return new Promise(function (resolve, reject) {
        if (clientToPass) {
            resolve(clientToPass);
        }
    });
}
//# sourceMappingURL=client-password-strategy.unit.js.map