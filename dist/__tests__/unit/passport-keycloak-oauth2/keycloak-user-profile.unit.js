"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const strategies_1 = require("../../../strategies");
describe('Keycloak userProfileFn', () => {
    it('should successfully resolve', async () => {
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
        const profilePromise = new Promise((resolve, reject) => {
            keycloakAuthStrategyVerifier._oauth2 = {
                _useAuthorizationHeaderForGET: false,
                get: testlab_1.sinon.stub().callsFake((url, token, cb) => {
                    cb(null, JSON.stringify({}));
                }),
            };
            keycloakAuthStrategyVerifier.userProfile('', (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        await (0, testlab_1.expect)(profilePromise).to.be.fulfilled();
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
//# sourceMappingURL=keycloak-user-profile.unit.js.map