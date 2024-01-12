import {Application, inject} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {RestServer} from '@loopback/rest';
import {Client, createClientForHandler, expect} from '@loopback/testlab';
import {authenticate} from '../../../../decorators';
import {AuthenticationBindings} from '../../../../keys';
import {Strategies} from '../../../../strategies/keys';
import {STRATEGY} from '../../../../strategy-name.enum';
import {IAuthUser} from '../../../../types';
import {BearerTokenVerifyProvider} from '../../../fixtures/providers/bearer-passport.provider';
import {MyAuthenticationMiddlewareSequence} from '../../../fixtures/sequences/authentication-middleware.sequence';
import {getApp} from '../helpers/helpers';

/**
 * Testing overall flow of authentication with bearer strategy
 */
describe('Bearer-token strategy using Middleware Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);
  beforeEach(getAuthVerifier);

  it('should return 401 when token is not passed', async () => {
    class BearerNoTokenController {
      @get('/auth/bearer/no-token')
      @authenticate(STRATEGY.BEARER)
      test() {
        return 'test successful';
      }
    }

    app.controller(BearerNoTokenController);

    await whenIMakeRequestTo(server).get('/auth/bearer/no-token').expect(401);
  });

  it('should return status 200 when token is passed', async () => {
    class BearerTokenController {
      @get('/auth/bearer/token')
      @authenticate(STRATEGY.BEARER)
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
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @get('/auth/bearer/no-options')
      @authenticate(STRATEGY.BEARER)
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
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/callback')
      @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
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
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-callback')
      @authenticate(STRATEGY.BEARER, {passReqToCallback: false})
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
      @authenticate(STRATEGY.BEARER)
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
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      @get('/auth/bearer/no-user')
      @authenticate(STRATEGY.BEARER)
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
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-user-with-callback')
      @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
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
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-user-when-callback-false')
      @authenticate(STRATEGY.BEARER, {passReqToCallback: false})
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
    server.sequence(MyAuthenticationMiddlewareSequence);
  }
});

describe('integration test when no provider was implemented using Middleware Sequence', () => {
  let app: Application;
  let server: RestServer;
  beforeEach(givenAServer);
  beforeEach(givenAuthenticatedSequence);

  it('should return error as the verifier is not implemented', async () => {
    class BearerNoVerifierController {
      constructor(
        @inject(AuthenticationBindings.CURRENT_USER) // tslint:disable-next-line: no-shadowed-variable
        private readonly user: IAuthUser | undefined,
      ) {}

      options = {
        passRequestToCallback: false,
      };

      @get('/auth/bearer/no-verifier')
      @authenticate(STRATEGY.BEARER, {passReqToCallback: false})
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
    server.sequence(MyAuthenticationMiddlewareSequence);
  }
});
