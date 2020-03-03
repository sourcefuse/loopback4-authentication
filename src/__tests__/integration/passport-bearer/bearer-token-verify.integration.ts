import {IAuthUser} from '../../../types';
import {expect, Client, createClientForHandler} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {Application, inject} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {authenticateUser} from '../../../decorators';
import {STRATEGY} from '../../../strategy-name.enum';
import {getApp} from '../helpers/helpers';
import {MyAuthenticationSequence} from '../../fixtures/sequences/authentication.sequence';
import {Strategies} from '../../../strategies/keys';
import {ExtAuthenticationBindings} from '../../../keys';
import {BearerTokenVerifyProvider} from '../../fixtures/providers/bearer-passport.provider';

/**
 * Testing overall flow of authentication with bearer strategy
 */
describe('Bearer-token strategy', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 401 when token is not passed', async () => {
    class BearerNoTokenController {
      @get('/auth/bearer/no-token')
      @authenticateUser(STRATEGY.BEARER)
      test() {
        return 'test successful';
      }
    }

    app.controller(BearerNoTokenController);

    await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-token')
      .expect(401);
  });

  it('should return status 200 when token is passed', async () => {
    class BearerTokenController {
      @get('/auth/bearer/token')
      @authenticateUser(STRATEGY.BEARER)
      test() {
        return 'test successful';
      }
    }

    app.controller(BearerTokenController);

    await whenIMakeRequestTo(server)
      .get('/auth/bearer/token')
      .set('Authorization', 'Bearer validtoken')
      .expect(200);
  });

  it('should return the user passed via verifier when no options are passed', async () => {
    class BearerNoOptionsController {
      constructor(
        @inject(ExtAuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @get('/auth/bearer/no-options')
      @authenticateUser(STRATEGY.BEARER)
      async test() {
        return this.user;
      }
    }

    app.controller(BearerNoOptionsController);

    const user = await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-options')
      .set('Authorization', 'Bearer validtoken')
      .expect(200);

    expect(user.body).to.have.property('id');
    expect(user.body.id).to.equal(1);
  });

  it('should return the user passed via verifier and options are passed with passRequestCallback true', async () => {
    class BearerForCallbackController {
      constructor(
        @inject(ExtAuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/callback')
      @authenticateUser(STRATEGY.BEARER, {passReqToCallback: true})
      async test() {
        return this.user;
      }
    }

    app.controller(BearerForCallbackController);

    const user = await whenIMakeRequestTo(server)
      .get('/auth/bearer/callback')
      .set('Authorization', 'Bearer validtoken')
      .expect(200);

    expect(user.body).to.have.property('id');
    expect(user.body.id).to.equal(2);
  });

  it('should return the user passed via verifier and options are passed with passRequestCallback false', async () => {
    class BearerNoCallbackController {
      constructor(
        @inject(ExtAuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-callback')
      @authenticateUser(STRATEGY.BEARER, {passReqToCallback: false})
      async test() {
        return this.user;
      }
    }

    app.controller(BearerNoCallbackController);

    const user = await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-callback')
      .set('Authorization', 'Bearer validtoken')
      .expect(200);

    expect(user.body).to.have.property('id');
    expect(user.body.id).to.equal(1);
  });

  it('should return status 401 as Bearer is not sent in token', async () => {
    class NoBearerInTokenController {
      @get('/auth/bearer/no-bearer-in-token')
      @authenticateUser(STRATEGY.BEARER)
      test() {
        return 'test successful';
      }
    }

    app.controller(NoBearerInTokenController);

    await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-bearer-in-token')
      .set('Authorization', 'sometoken')
      .expect(401);
  });

  it('should return error as no user was returned from provider', async () => {
    class BearerNoUserController {
      constructor(
        @inject(ExtAuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @get('/auth/bearer/no-user')
      @authenticateUser(STRATEGY.BEARER)
      async test() {
        return this.user;
      }
    }

    app.controller(BearerNoUserController);

    await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-user')
      .set('Authorization', 'Bearer sometoken')
      .expect(401);
  });

  it('should return error when passRequestCallback is true and provider is not returning user', async () => {
    class BearerNoUserFromCallbackController {
      constructor(
        @inject(ExtAuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-user-with-callback')
      @authenticateUser(STRATEGY.BEARER, {passReqToCallback: true})
      async test() {
        return this.user;
      }
    }

    app.controller(BearerNoUserFromCallbackController);

    await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-user-with-callback')
      .set('Authorization', 'Bearer sometoken')
      .expect(401);
  });

  it('should return error when options are passed with passRequestCallback false and provider does not return user', async () => {
    class BearerCallbackFalseController {
      constructor(
        @inject(ExtAuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-user-when-callback-false')
      @authenticateUser(STRATEGY.BEARER, {passReqToCallback: false})
      async test() {
        return this.user;
      }
    }

    app.controller(BearerCallbackFalseController);

    await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-user-when-callback-false')
      .set('Authorization', 'Bearer sometoken')
      .expect(401);
  });

  function whenIMakeRequestTo(restServer: RestServer): Client {
    return createClientForHandler(restServer.requestHandler);
  }

  async function givenAServer() {
    app = getApp();
    server = await app.getServer(RestServer);
  }

  function getAuthVerifier() {
    app
      .bind(Strategies.Passport.BEARER_TOKEN_VERIFIER)
      .toProvider(BearerTokenVerifyProvider);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});

describe('integration test when no provider was implemented', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);

  it('should return error as the verifier is not implemented', async () => {
    class BearerNoVerifierController {
      constructor(
        @inject(ExtAuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-verifier')
      @authenticateUser(STRATEGY.BEARER, {passReqToCallback: false})
      async test() {
        return this.user;
      }
    }

    app.controller(BearerNoVerifierController);

    await whenIMakeRequestTo(server)
      .get('/auth/bearer/no-verifier')
      .set('Authorization', 'Bearer sometoken')
      .expect(401);
  });

  function whenIMakeRequestTo(restServer: RestServer): Client {
    return createClientForHandler(restServer.requestHandler);
  }

  async function givenAServer() {
    app = getApp();
    server = await app.getServer(RestServer);
  }

  function givenAuthenticatedSequence() {
    // bind user defined sequence
    server.sequence(MyAuthenticationSequence);
  }
});
