"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const passport_insta_oauth2_1 = require("../../../strategies/passport/passport-insta-oauth2");
describe('getting instagram-auth strategy with options', () => {
    it('should return strategy by passing options and passReqToCallback as true', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            callbackURL: '',
            clientID: 'string',
            clientSecret: 'string',
            passReqToCallback: true,
        };
        const instagramAuthStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(instagramAuthStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(instagramAuthStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
    it('should return strategy by passing options and passReqToCallback as false', async () => {
        const strategyVerifier = await getStrategy();
        const options = {
            callbackURL: '',
            clientID: 'string',
            clientSecret: 'string',
            passReqToCallback: false,
        };
        const instagramAuthStrategyVerifier = strategyVerifier(options);
        (0, testlab_1.expect)(instagramAuthStrategyVerifier).to.have.property('name');
        (0, testlab_1.expect)(instagramAuthStrategyVerifier)
            .to.have.property('authenticate')
            .which.is.a.Function();
    });
});
async function getStrategy() {
    const provider = new passport_insta_oauth2_1.InstagramAuthStrategyFactoryProvider(verifierBearer);
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
//# sourceMappingURL=instagram-auth-strategy.unit.js.map