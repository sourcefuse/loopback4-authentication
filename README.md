# loopback4-authentication

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

[![Node version](https://img.shields.io/node/v/loopback4-authentication.svg?style=flat-square)](https://nodejs.org/en/download/)
[![Dependencies Status](https://img.shields.io/david/sourcefuse/loopback4-authentication.svg?style=flat-square&label=Dependencies)](https://github.com/sourcefuse/loopback4-authentication)
[![npm vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/loopback4-authentication.svg?label=npm%20vulnerabilities&style=flat-square)](https://www.npmjs.com/package/loopback4-authentication)

[![Latest version](https://img.shields.io/npm/v/loopback4-authentication.svg?style=flat-square)](https://www.npmjs.com/package/loopback4-authentication)
[![License](https://img.shields.io/github/license/sourcefuse/loopback4-authentication.svg?color=blue&label=License&style=flat-square)](https://github.com/sourcefuse/loopback4-authentication/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dw/loopback4-authentication.svg?label=Downloads&style=flat-square&color=blue)](https://www.npmjs.com/package/loopback4-authentication)
[![Total Downloads](https://img.shields.io/npm/dt/loopback4-authentication.svg?label=Total%20Downloads&style=flat-square&color=blue)](https://www.npmjs.com/package/loopback4-authentication)

This is a loopback-next extension for adding authentication layer to a REST application in loopback 4.
It provides support for four passport based strategies.

1. [passport-oauth2-client-password](https://github.com/jaredhanson/passport-oauth2-client-password) - OAuth 2.0 client password authentication strategy for Passport. This module lets you authenticate requests containing client credentials in the request body, as [defined](http://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-2.3.1) by the OAuth 2.0 specification.
2. [passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer) - HTTP Bearer authentication strategy for Passport. This module lets you authenticate HTTP requests using bearer tokens, as specified by [RFC 6750](https://tools.ietf.org/html/rfc6750), in your Node.js applications.
3. [passport-local](https://github.com/jaredhanson/passport-local) - Passport strategy for authenticating with a username and password. This module lets you authenticate using a username and password in your Node.js applications.
4. [passport-oauth2-resource-owner-password](https://www.npmjs.com/package/passport-oauth2-resource-owner-password) - OAuth 2.0 resource owner password authentication strategy for Passport. This module lets you authenticate requests containing resource owner credentials in the request body, as [defined](http://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-1.3.3) by the OAuth 2.0 specification.

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

Add the verifier function for the strategy. You need to create a provider for the same. You can add your application specific business logic for client auth here. Here is simple example.

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
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(
  AuthenticationBindings.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER,
).toProvider(ClientPasswordVerifyProvider);
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
    return async token => {
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as User;
      return user;
    };
  }
}
```

Please note the Verify function type _VerifyFunction.BearerFn_

Now bind this provider to the application in application.ts.

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(AuthenticationBindings.Passport.BEARER_TOKEN_VERIFIER).toProvider(
  BearerTokenVerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts as shown previously.

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
  ) {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (username, password) => {
      const user: User = new User(
        await this.userRepository.verifyPassword(username, password),
      );
      return user;
    };
  }
}
```

Please note the Verify function type _VerifyFunction.LocalPasswordFn_

Now bind this provider to the application in application.ts.

```ts
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(AuthenticationBindings.Passport.LOCAL_PASSWORD_VERIFIER).toProvider(
  LocalPasswordVerifyProvider,
);
```

Finally, add the authenticate function as a sequence action to sequence.ts as shown previously.

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
// Add authentication component
this.component(AuthenticationComponent);
// Customize authentication verify handlers
this.bind(
  AuthenticationBindings.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER,
).toProvider(ResourceOwnerVerifyProvider);
```

Finally, add the authenticate function as a sequence action to sequence.ts as shown previously.

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
