"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const strategies_1 = require("../../../strategies");
describe('getting local strategy with options', () => {
    it('should return strategy by passing options and passReqToCallback as true', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            passReqToCallback: true,
        };
        const localStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(localStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(localStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by passing options and passReqToCallback as false', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            passReqToCallback: false,
        };
        const localStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(localStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(localStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by not passing any options', async () => {
        const strategyVerifier = await getStrategy();
        const localStrategyVerifier = strategyVerifier();
        (0, testlab_1.expect)(localStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(localStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new strategies_1.LocalPasswordStrategyFactoryProvider(verifierLocal);
    //this fuction will return a function which will then accept options.
    return provider.value();
}
//returning a user
function verifierLocal(username, password, req) {
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
//# sourceMappingURL=local-strategy.unit.js.map