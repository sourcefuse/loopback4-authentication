# loopback4-authentication

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

[![Node version](https://img.shields.io/node/v/loopback4-authentication.svg?style=flat-square)](https://nodejs.org/en/download/)
[![Dependencies Status](https://img.shields.io/david/sourcefuse/loopback4-authentication.svg?style=flat-square&label=Dependencies)](https://github.com/sourcefuse/loopback4-authentication)
[![Loopback Core Version](https://img.shields.io/npm/dependency-version/loopback4-authentication/@loopback/core.svg?color=dark%20green&style=flat-square)](https://github.com/strongloop/loopback-next)
[![Loopback Build Version](https://img.shields.io/npm/dependency-version/loopback4-authentication/dev/@loopback/build.svg?color=dark%20green&style=flat-square)](https://github.com/strongloop/loopback-next/tree/master/packages/build)

[![npm vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/loopback4-authentication.svg?label=npm%20vulnerabilities&style=flat-square)](https://www.npmjs.com/package/loopback4-authentication)

[![Latest version](https://img.shields.io/npm/v/loopback4-authentication.svg?style=flat-square)](https://www.npmjs.com/package/loopback4-authentication)
[![License](https://img.shields.io/github/license/sourcefuse/loopback4-authentication.svg?color=blue&label=License&style=flat-square)](https://github.com/sourcefuse/loopback4-authentication/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dw/loopback4-authentication.svg?label=Downloads&style=flat-square&color=blue)](https://www.npmjs.com/package/loopback4-authentication)
[![Total Downloads](https://img.shields.io/npm/dt/loopback4-authentication.svg?label=Total%20Downloads&style=flat-square&color=blue)](https://www.npmjs.com/package/loopback4-authentication)

This is a loopback-next extension for adding authentication layer to a REST application in loopback 4.
This extension is based on the implementation guidelines provided on official [@loopback/authentication](https://github.com/strongloop/loopback-next/blob/master/packages/authentication/README.md) page.
It provides support for seven passport based strategies.

1. [passport-oauth2-client-password](https://github.com/jaredhanson/passport-oauth2-client-password) - OAuth 2.0 client password authentication strategy for Passport. This module lets you authenticate requests containing client credentials in the request body, as [defined](http://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-2.3.1) by the OAuth 2.0 specification.
2. [passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer) - HTTP Bearer authentication strategy for Passport. This module lets you authenticate HTTP requests using bearer tokens, as specified by [RFC 6750](https://tools.ietf.org/html/rfc6750), in your Node.js applications.
3. [passport-local](https://github.com/jaredhanson/passport-local) - Passport strategy for authenticating with a username and password. This module lets you authenticate using a username and password in your Node.js applications.
4. [passport-oauth2-resource-owner-password](https://www.npmjs.com/package/passport-oauth2-resource-owner-password) - OAuth 2.0 resource owner password authentication strategy for Passport. This module lets you authenticate requests containing resource owner credentials in the request body, as [defined](http://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-1.3.3) by the OAuth 2.0 specification.
5. [passport-google-oauth2](https://github.com/jaredhanson/passport-google-oauth2) - Passport strategy for authenticating with Google using the Google OAuth 2.0 API. This module lets you authenticate using Google in your Node.js applications.
6. [keycloak-passport](https://github.com/exlinc/keycloak-passport) - Passport strategy for authenticating with Keycloak. This library offers a production-ready and maintained Keycloak Passport connector.
7. [passport-instagram](https://github.com/jaredhanson/passport-instagram) - Passport strategy for authenticating with Instagram using the Instagram OAuth 2.0 API. This module lets you authenticate using Instagram in your Node.js applications.

You can use one or more strategies of the above in your application. For each of the strategy (only which you use), you just need to provide your own verifier function, making it easily configurable. Rest of the strategy implementation intricacies is handled by extension.

## Install

```sh
npm install loopback4-authentication
```

## Quick Starter

For a quick starter guide, you can refer to our [loopback 4 starter](https://github.com/sourcefuse/loopback4-starter) application which utilizes all of the above auth strategies from the extension in a simple multi-tenant application. Refer to the auth module [there](https://github.com/sourcefuse/loopback4-starter/tree/master/src/modules/auth) for specific details on authentication.

## Detailed Usage

The first and common step for all of the startegies is to add the component to the application. See below

```ts
// application.ts
export class ToDoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Add authentication component
    this.component(AuthenticationComponent);

    // .... Rest of the code below
  }
}
```

Once this is done, you are ready to configure any of the available strategy in the application.

### Oauth2-client-password

First, create an AuthClient model implementing the IAuthClient interface. The purpose of this model is to store oauth registered clients for the app in the DB. See sample below.

```ts
@model({
  name: 'auth_clients',
})
export class AuthClient extends Entity implements IAuthClient {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'client_id',
  })
  clientId: string;

  @property({
    type: 'string',
    required: true,
    name: 'client_secret',
  })
  clientSecret: string;

  @property({
    type: 'array',
    itemType: 'number',
    name: 'user_ids',
  })
  userIds: number[];

  constructor(data?: Partial<AuthClient>) {
    super(data);
  }
}
```

Create CRUD repository for the above model. Use loopback CLI.

```sh
lb4 repository
```

Add the verifier function for the strategy. You need to create a provider for the same strategy. You can add your application specific business logic for client auth here. Here is simple example.

```ts
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';

import {AuthClientRepository} from '../../../repositories';

export class ClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn> {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) {}

  value(): VerifyFunction.OauthClientPasswordFn {
    return async (clientId, clientSecret, req) => {
      return this.authClientRepository.findOne({
        where: {
          clientId,
          clientSecret,
        },
      });
    };
  }
}
```

Please note the Verify function type _VerifyFunction.OauthClientPasswordFn_.

Now bind this provider to the application in application.ts.

```ts
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
```

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER).toProvider(
  ClientPasswordVerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts.

```ts
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    // Inject CLIENT_AUTH_ACTION sequence action provider
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateRequestClient: AuthenticateFn<AuthClient>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];

      // Perform client authentication here
      await this.authenticateRequestClient(request);

      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

After this, you can use decorator to apply auth to controller functions wherever needed. See below.

```ts
@authenticateClient(STRATEGY.CLIENT_PASSWORD, {
  passReqToCallback: true
})
@post('/auth/login', {
  responses: {
    [STATUS_CODE.OK]: {
      description: 'Auth Code',
      content: {
        [CONTENT_TYPE.JSON]: Object,
      },
    },
  },
})
async login(
  @requestBody()
  req: LoginRequest,
): Promise<{
  code: string;
}> {
  ....
}
```

For accessing the authenticated AuthClient model reference, you can inject the CURRENT_CLIENT provider, provided by the extension, which is populated by the auth action sequence above.

```ts
  @inject.getter(AuthenticationBindings.CURRENT_CLIENT)
  private readonly getCurrentClient: Getter<AuthClient>,
```

### Http-bearer

First, create a AuthUser model implementing the IAuthUser interface. You can implement the interface in the user model itself. See sample below.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

Create CRUD repository for the above model. Use loopback CLI.

```sh
lb4 repository
```

Add the verifier function for the strategy. You need to create a provider for the same. You can add your application specific business logic for client auth here. Here is simple example for JWT tokens.

```ts
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';

import {User} from '../models/user.model';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async (token) => {
      if (token && (await this.revokedTokenRepository.get(token))) {
        throw new HttpErrors.Unauthorized('Token Revoked');
      }
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as User;
      return user;
    };
  }
}
```

The above example has an import and injection of a RevokedTokenRepository, which could be used to keep track of revoked tokens in a datasource like Redis. You can find an implementation of this repository [here](https://github.com/sourcefuse/loopback4-starter/blob/master/src/repositories/revoked-token.repository.ts) and the Redis datasource [here](https://github.com/sourcefuse/loopback4-starter/blob/master/src/datasources/redis.datasource.ts).

Please note the Verify function type _VerifyFunction.BearerFn_

Now bind this provider to the application in application.ts.

```ts
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
```

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
  BearerTokenVerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts.

```ts
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const authUser: AuthUser = await this.authenticateRequest(request);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

After this, you can use decorator to apply auth to controller functions wherever needed. See below.

```ts
@authenticate(STRATEGY.BEARER)
@get('/users', {
  responses: {
    '200': {
      description: 'Array of User model instances',
      content: {
        'application/json': {
          schema: {type: 'array', items: {'x-ts-type': User}},
        },
      },
    },
  },
})
async find(
  @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter,
): Promise<User[]> {
  return await this.userRepository.find(filter);
}
```

For accessing the authenticated AuthUser model reference, you can inject the CURRENT_USER provider, provided by the extension, which is populated by the auth action sequence above.

```ts
  @inject.getter(AuthenticationBindings.CURRENT_USER)
  private readonly getCurrentUser: Getter<User>,
```

### local

First, create a AuthUser model implementing the IAuthUser interface. You can implement the interface in the user model itself. See sample below.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

Create CRUD repository for the above model. Use loopback CLI.

```sh
lb4 repository
```

Add the verifier function for the strategy. You need to create a provider for the same. You can add your application specific business logic for client auth here. Here is a simple example.

```ts
export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  value(): VerifyFunction.LocalPasswordFn {
    return async (username: any, password: any) => {
      try {
        const user: AuthUser = new AuthUser(
          await this.userRepository.verifyPassword(username, password),
        );
        return user;
      } catch (error) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials).message;
      }
    };
  }
}
```

Please note the Verify function type _VerifyFunction.LocalPasswordFn_

Now bind this provider to the application in application.ts.

```ts
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
```

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER).toProvider(
  LocalPasswordVerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts.

```ts
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const authUser: AuthUser = await this.authenticateRequest(request);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

After this, you can use decorator to apply auth to controller functions wherever needed. See below.

```ts
  @authenticate(STRATEGY.LOCAL)
  @post('/auth/login', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Auth Code',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
    },
  })
  async login(
    @requestBody()
    req: LoginRequest,
  ): Promise<{
    code: string;
  }> {
    ......
  }
```

For accessing the authenticated AuthUser model reference, you can inject the CURRENT_USER provider, provided by the extension, which is populated by the auth action sequence above.

```ts
  @inject.getter(AuthenticationBindings.CURRENT_USER)
  private readonly getCurrentUser: Getter<User>,
```

### Oauth2-resource-owner-password

First, create an AuthClient model implementing the IAuthClient interface. The purpose of this model is to store oauth registered clients for the app in the DB. See sample below.

```ts
@model({
  name: 'auth_clients',
})
export class AuthClient extends Entity implements IAuthClient {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'client_id',
  })
  clientId: string;

  @property({
    type: 'string',
    required: true,
    name: 'client_secret',
  })
  clientSecret: string;

  @property({
    type: 'array',
    itemType: 'number',
    name: 'user_ids',
  })
  userIds: number[];

  constructor(data?: Partial<AuthClient>) {
    super(data);
  }
}
```

Next, create a AuthUser model implementing the IAuthUser interface. You can implement the interface in the user model itself. See sample below.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

Create CRUD repository for both of the above models. Use loopback CLI.

```sh
lb4 repository
```

Add the verifier function for the strategy. You need to create a provider for the same. You can add your application specific business logic for client auth here. Here is a simple example.

```ts
export class ResourceOwnerVerifyProvider
  implements Provider<VerifyFunction.ResourceOwnerPasswordFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) {}

  value(): VerifyFunction.ResourceOwnerPasswordFn {
    return async (clientId, clientSecret, username, password) => {
      const user = await this.userRepository.verifyPassword(username, password);
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      const client = await this.authClientRepository.findOne({
        where: {
          clientId,
        },
      });
      if (!client || client.userIds.indexOf(user.id || 0) < 0) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      } else if (!client.clientSecret || client.clientSecret !== clientSecret) {
        throw new HttpErrors.Unauthorized(
          AuthErrorKeys.ClientVerificationFailed,
        );
      }
      return {
        client,
        user,
      };
    };
  }
}
```

Please note the Verify function type _VerifyFunction.LocalPasswordFn_.
Also, in this case, verifier will return AuthClient as well as User model.

Now bind this provider to the application in application.ts.

```ts
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
```

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER).toProvider(
  ResourceOwnerVerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts.

```ts
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const authUser: AuthUser = await this.authenticateRequest(request);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

After this, you can use decorator to apply auth to controller functions wherever needed. See below.

```ts
  @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT)
  @post('/auth/login-token', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response Model',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async loginWithClientUser(
    @requestBody() req: LoginRequest,
  ): Promise<TokenResponse> {
    ......
  }
```

For accessing the authenticated AuthUser and AuthClient model reference, you can inject the CURRENT_USER and CURRENT_CLIENT provider, provided by the extension, which is populated by the auth action sequence above.

```ts
  @inject.getter(AuthenticationBindings.CURRENT_USER)
  private readonly getCurrentUser: Getter<User>,
  @inject.getter(AuthenticationBindings.CURRENT_CLIENT)
  private readonly getCurrentClient: Getter<AuthClient>,
```

### Google Oauth 2

First, create a AuthUser model implementing the IAuthUser interface. You can implement the interface in the user model itself. See sample below.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  // Auth provider - 'google'
  @property({
    type: 'string',
    required: true,
    name: 'auth_provider',
  })
  authProvider: string;

  // Id from external provider
  @property({
    type: 'string',
    name: 'auth_id',
  })
  authId?: string;

  @property({
    type: 'string',
    name: 'auth_token',
  })
  authToken?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

Create CRUD repository for the above model. Use loopback CLI.

```sh
lb4 repository
```

Add the verifier function for the strategy. You need to create a provider for the same. You can add your application specific business logic for client auth here. Here is a simple example.

```ts
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

import {Tenant} from '../../../models';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {AuthUser} from '../models/auth-user.model';

export class GoogleOauth2VerifyProvider
  implements Provider<VerifyFunction.GoogleAuthFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
  ) {}

  value(): VerifyFunction.GoogleAuthFn {
    return async (accessToken, refreshToken, profile) => {
      const user = await this.userRepository.findOne({
        where: {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          email: (profile as any)._json.email,
        },
      });
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      if (
        !user ||
        user.authProvider !== 'google' ||
        user.authId !== profile.id
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser(user);
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      authUser.tenant = new Tenant({id: user.defaultTenant});
      return authUser;
    };
  }
}
```

Please note the Verify function type _VerifyFunction.LocalPasswordFn_

Now bind this provider to the application in application.ts.

```ts
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
```

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER).toProvider(
  GoogleOauth2VerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts.

```ts
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const authUser: AuthUser = await this.authenticateRequest(
        request,
        response,
      );
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

After this, you can use decorator to apply auth to controller functions wherever needed. See below.

```ts
@authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.GOOGLE_OAUTH2,
    {
      accessType: 'offline',
      scope: ['profile', 'email'],
      authorizationURL: process.env.GOOGLE_AUTH_URL,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      tokenURL: process.env.GOOGLE_AUTH_TOKEN_URL,
    },
    (req: Request) => {
      return {
        accessType: 'offline',
        state: Object.keys(req.query)
          .map(key => key + '=' + req.query[key])
          .join('&'),
      };
    },
  )
  @authorize(['*'])
  @get('/auth/google', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async loginViaGoogle(
    @param.query.string('client_id')
    clientId?: string,
    @param.query.string('client_secret')
    clientSecret?: string,
  ): Promise<void> {}

  @authenticate(
    STRATEGY.GOOGLE_OAUTH2,
    {
      accessType: 'offline',
      scope: ['profile', 'email'],
      authorizationURL: process.env.GOOGLE_AUTH_URL,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      tokenURL: process.env.GOOGLE_AUTH_TOKEN_URL,
    },
    (req: Request) => {
      return {
        accessType: 'offline',
        state: Object.keys(req.query)
          .map(key => `${key}=${req.query[key]}`)
          .join('&'),
      };
    },
  )
  @authorize(['*'])
  @get('/auth/google-auth-redirect', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async googleCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    const clientId = new URLSearchParams(state).get('client_id');
    if (!clientId || !this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    const client = await this.authClientRepository.findOne({
      where: {
        clientId: clientId,
      },
    });
    if (!client || !client.redirectUrl) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const codePayload: ClientAuthCode<User> = {
        clientId,
        user: this.user,
      };
      const token = jwt.sign(codePayload, client.secret, {
        expiresIn: client.authCodeExpiration,
        audience: clientId,
        subject: this.user.username,
        issuer: process.env.JWT_ISSUER,
      });
      response.redirect(`${client.redirectUrl}?code=${token}`);
    } catch (error) {
      throw new HttpErrors.InternalServerError(AuthErrorKeys.UnknownError);
    }
  }
```

Please note above that we are creating two new APIs for google auth. The first one is for UI clients to hit. We are authenticating client as well, then passing the details to the google auth. Then, the actual authentication is done by google authorization url, which redirects to the second API we created after success. The first API method body is empty as we do not need to handle its response. The google auth provider in this package will do the redirection for you automatically.

For accessing the authenticated AuthUser model reference, you can inject the CURRENT_USER provider, provided by the extension, which is populated by the auth action sequence above.

```ts
  @inject.getter(AuthenticationBindings.CURRENT_USER)
  private readonly getCurrentUser: Getter<User>,
```

### Instagram Oauth 2

First, create a AuthUser model implementing the IAuthUser interface. You can implement the interface in the user model itself. See sample below.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  // Auth provider - 'instagram'
  @property({
    type: 'string',
    required: true,
    name: 'auth_provider',
  })
  authProvider: string;

  // Id from external provider
  @property({
    type: 'string',
    name: 'auth_id',
  })
  authId?: string;

  @property({
    type: 'string',
    name: 'auth_token',
  })
  authToken?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

Create CRUD repository for the above model. Use loopback CLI.

```sh
lb4 repository
```

Add the verifier function for the strategy. You need to create a provider for the same. You can add your application specific business logic for client auth here. Here is a simple example.

```ts
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

import {Tenant} from '../../../models';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {AuthUser} from '../models/auth-user.model';

export class InstagramOauth2VerifyProvider
  implements Provider<VerifyFunction.InstagramAuthFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
  ) {}

  value(): VerifyFunction.InstagramAuthFn {
    return async (accessToken, refreshToken, profile) => {
      const user = await this.userRepository.findOne({
        where: {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          email: (profile as any)._json.email,
        },
      });
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      if (
        !user ||
        user.authProvider !== 'instagram' ||
        user.authId !== profile.id
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser(user);
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      authUser.tenant = new Tenant({id: user.defaultTenant});
      return authUser;
    };
  }
}
```

Please note the Verify function type _VerifyFunction.LocalPasswordFn_

Now bind this provider to the application in application.ts.

```ts
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
```

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(Strategies.Passport.INSTAGRAM_OAUTH2_VERIFIER).toProvider(
  InstagramOauth2VerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts.

```ts
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const authUser: AuthUser = await this.authenticateRequest(
        request,
        response,
      );
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

After this, you can use decorator to apply auth to controller functions wherever needed. See below.

```ts
@authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.INSTAGRAM_OAUTH2,
    {
      accessType: 'offline',
      authorizationURL: process.env.INSTAGRAM_AUTH_URL,
      callbackURL: process.env.INSTAGRAM_AUTH_CALLBACK_URL,
      clientID: process.env.INSTAGRAM_AUTH_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_AUTH_CLIENT_SECRET,
      tokenURL: process.env.INSTAGRAM_AUTH_TOKEN_URL,
    },
    (req: Request) => {
      return {
        accessType: 'offline',
        state: Object.keys(req.query)
          .map(key => key + '=' + req.query[key])
          .join('&'),
      };
    },
  )
  @authorize(['*'])
  @get('/auth/instagram', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async loginViaInstagram(
    @param.query.string('client_id')
    clientId?: string,
    @param.query.string('client_secret')
    clientSecret?: string,
  ): Promise<void> {}

  @authenticate(
    STRATEGY.INSTAGRAM_OAUTH2,
    {
      accessType: 'offline',
      authorizationURL: process.env.INSTAGRAM_AUTH_URL,
      callbackURL: process.env.INSTAGRAM_AUTH_CALLBACK_URL,
      clientID: process.env.INSTAGRAM_AUTH_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_AUTH_CLIENT_SECRET,
      tokenURL: process.env.INSTAGRAM_AUTH_TOKEN_URL,
    },
    (req: Request) => {
      return {
        accessType: 'offline',
        state: Object.keys(req.query)
          .map(key => `${key}=${req.query[key]}`)
          .join('&'),
      };
    },
  )
  @authorize(['*'])
  @get('/auth/instagram-auth-redirect', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async instagramCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    const clientId = new URLSearchParams(state).get('client_id');
    if (!clientId || !this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    const client = await this.authClientRepository.findOne({
      where: {
        clientId: clientId,
      },
    });
    if (!client || !client.redirectUrl) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const codePayload: ClientAuthCode<User> = {
        clientId,
        user: this.user,
      };
      const token = jwt.sign(codePayload, client.secret, {
        expiresIn: client.authCodeExpiration,
        audience: clientId,
        subject: this.user.username,
        issuer: process.env.JWT_ISSUER,
      });
      response.redirect(`${client.redirectUrl}?code=${token}`);
    } catch (error) {
      throw new HttpErrors.InternalServerError(AuthErrorKeys.UnknownError);
    }
  }
```

Please note above that we are creating two new APIs for instagram auth. The first one is for UI clients to hit. We are authenticating client as well, then passing the details to the instagram auth. Then, the actual authentication is done by instagram authorization url, which redirects to the second API we created after success. The first API method body is empty as we do not need to handle its response. The instagram auth provider in this package will do the redirection for you automatically.

For accessing the authenticated AuthUser model reference, you can inject the CURRENT_USER provider, provided by the extension, which is populated by the auth action sequence above.

```ts
  @inject.getter(AuthenticationBindings.CURRENT_USER)
  private readonly getCurrentUser: Getter<User>,
```

### Keycloak

First, create a AuthUser model implementing the IAuthUser interface. You can implement the interface in the user model itself. See sample below.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  // Auth provider - 'keycloak'
  @property({
    type: 'string',
    required: true,
    name: 'auth_provider',
  })
  authProvider: string;

  // Id from external provider
  @property({
    type: 'string',
    name: 'auth_id',
  })
  authId?: string;

  @property({
    type: 'string',
    name: 'auth_token',
  })
  authToken?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

Create CRUD repository for the above model. Use loopback CLI.

```sh
lb4 repository
```

Add the verifier function for the strategy. You need to create a provider for the same. You can add your application specific business logic for client auth here. Here is a simple example.

```ts
import {Provider, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthErrorKeys,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';

import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {AuthUser} from '../models/auth-user.model';

export class KeycloakVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
  ) {}

  value(): VerifyFunction.KeycloakAuthFn {
    return async (accessToken, refreshToken, profile) => {
      let user: IAuthUser | null = await this.userRepository.findOne({
        where: {
          email: profile.email,
        },
      });
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id as string,
        },
      });
      if (
        !creds ||
        creds.authProvider !== 'keycloak' ||
        creds.authId !== profile.keycloakId
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser({
        ...user,
        id: user.id as string,
      });
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      return authUser;
    };
  }
}
```

Please note the Verify function type _VerifyFunction.KeycloakAuthFn_

Now bind this provider to the application in application.ts.

```ts
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
```

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(Strategies.Passport.KEYCLOAK_VERIFIER).toProvider(
  KeycloakVerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts.

```ts
export class MySequence implements SequenceHandler {
  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const authUser: AuthUser = await this.authenticateRequest(
        request,
        response,
      );
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

After this, you can use decorator to apply auth to controller functions wherever needed. See below.

```ts
@authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM, //'Tenant1',
      clientID: process.env.KEYCLOAK_CLIENT_ID, //'onboarding',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET, //'e607fd75-adc8-4af7-9f03-c9e79a4b8b72',
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL, //'http://localhost:3001/auth/keycloak-auth-redirect',
      authorizationURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      tokenURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userInfoURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    },
    keycloakQueryGen,
  )
  @authorize({permissions: ['*']})
  @get('/auth/keycloak', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Keycloak Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async loginViaKeycloak(
    @param.query.string('client_id')
    clientId?: string,
    @param.query.string('client_secret')
    clientSecret?: string,
  ): Promise<void> {}

  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM,
      clientID: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL,
      authorizationURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      tokenURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userInfoURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    },
    keycloakQueryGen,
  )
  @authorize({permissions: ['*']})
  @get('/auth/keycloak-auth-redirect', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Keycloak Redirect Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async keycloakCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    const clientId = new URLSearchParams(state).get('client_id');
    if (!clientId || !this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    const client = await this.authClientRepository.findOne({
      where: {
        clientId,
      },
    });
    if (!client || !client.redirectUrl) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const codePayload: ClientAuthCode<User, typeof User.prototype.id> = {
        clientId,
        user: this.user,
      };
      const token = jwt.sign(codePayload, client.secret, {
        expiresIn: client.authCodeExpiration,
        audience: clientId,
        subject: this.user.username,
        issuer: process.env.JWT_ISSUER,
      });
      response.redirect(
        `${client.redirectUrl}?code=${token}&user=${this.user.username}`,
      );
    } catch (error) {
      this.logger.error(error);
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
  }
```

Please note above that we are creating two new APIs for keycloak auth. The first one is for UI clients to hit. We are authenticating client as well, then passing the details to the keycloak auth. Then, the actual authentication is done by keycloak authorization url, which redirects to the second API we created after success. The first API method body is empty as we do not need to handle its response. The keycloak auth provider in this package will do the redirection for you automatically.

For accessing the authenticated AuthUser model reference, you can inject the CURRENT_USER provider, provided by the extension, which is populated by the auth action sequence above.

```ts
  @inject.getter(AuthenticationBindings.CURRENT_USER)
  private readonly getCurrentUser: Getter<User>,
```

### Custom Verifier for Individual Routes

For providing a custom verifier for a particular route, you can pass a binding key for a verifier provider as the fourth parameter of the authenticate decorator.
Note - The key VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER can be any custom key, it just be bound to a verify function provider.

```ts
  @authenticate(
    STRATEGY.BEARER,
    undefined, //options
    undefined, //authOptions
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
```

And binding this key to a verifier in the application.ts

```ts
this.bind(VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER).toProvider(
  LocalPreSignupProvider as Constructor<Provider<PreSignupFn>>,
);
```

### Https proxy support for keycloak and google auth

If a https proxy agent is needed for keycloak and google auth, just add an environment variable named `HTTPS_PROXY` or `https_proxy` with proxy url as value. It will add that proxy agent to the request.

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-authentication/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-authentication/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/sourcefuse/loopback4-authentication/blob/master/.github/CONTRIBUTING.md) for details on the process for submitting pull requests to us.

## Code of conduct

Code of conduct guidelines [here](https://github.com/sourcefuse/loopback4-authentication/blob/master/.github/CODE_OF_CONDUCT.md).

## License

[MIT](https://github.com/sourcefuse/loopback4-authentication/blob/master/LICENSE)
