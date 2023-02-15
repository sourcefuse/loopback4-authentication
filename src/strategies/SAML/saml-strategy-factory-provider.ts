// SONAR-IGNORE-ALL
import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {AnyObject} from '@loopback/repository';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {
  Profile,
  Strategy,
  VerifiedCallback,
  SamlConfig,
  VerifyWithRequest,
  VerifyWithoutRequest,
} from '@node-saml/passport-saml';
import {AuthErrorKeys} from '../../error-keys';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';
export interface SamlStrategyFactory {
  (options: SamlConfig, verifierPassed?: VerifyFunction.SamlFn): Strategy;
}

export class SamlStrategyFactoryProvider
  implements Provider<SamlStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.SAML_VERIFIER)
    private readonly verifierSaml: VerifyFunction.SamlFn,
  ) {}

  value(): SamlStrategyFactory {
    return (options, verifier) =>
      this.getSamlStrategyVerifier(options, verifier);
  }

  getSamlStrategyVerifier(
    options: SamlConfig,
    verifierPassed?: VerifyFunction.SamlFn,
  ): Strategy {
    const verifyFn = verifierPassed ?? this.verifierSaml;
    let strategy;
    const func = async (
      req: Request,
      profile: Profile | null | undefined,
      cb: VerifiedCallback,
    ) => {
      try {
        const user = await verifyFn(profile, cb, req);
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        cb(null, user as unknown as Record<string, unknown>);
      } catch (err) {
        cb(err);
      }
    };
    if (options && options.passReqToCallback === true) {
      strategy = new Strategy(
        options,
        logoutVerify as VerifyWithRequest,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        func,
      );
    } else {
      strategy = new Strategy(
        options,
        logoutVerify as unknown as VerifyWithoutRequest,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (profile: Profile | null | undefined, cb: VerifiedCallback) => {
          try {
            const user = await verifyFn(profile, cb);
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(null, user as unknown as Record<string, unknown>);
          } catch (err) {
            cb(err);
          }
        },
      );
    }
    this._setupProxy(strategy);
    return strategy;
  }

  private _setupProxy(strategy: AnyObject) {
    // Setup proxy if any
    let httpsProxyAgent;
    if (process.env['https_proxy']) {
      httpsProxyAgent = new HttpsProxyAgent(process.env['https_proxy']);
      strategy._oauth2.setAgent(httpsProxyAgent);
    } else if (process.env['HTTPS_PROXY']) {
      httpsProxyAgent = new HttpsProxyAgent(process.env['HTTPS_PROXY']);
      strategy._oauth2.setAgent(httpsProxyAgent);
    } else {
      //this is intentional
    }
  }
}
function logoutVerify(
  req: Request<AnyObject, AnyObject, AnyObject>,
  profile: Profile | null,
  done: VerifiedCallback,
): void {
  // Check if a user is currently authenticated
  if (req.isAuthenticated()) {
    // Log the user out by removing their session data
    req.logout(done);
    // Call the "done" callback to indicate success
    done(null, {message: 'User successfully logged out'});
  } else {
    // Call the "done" callback with an error to indicate that the user is not logged in
    done(new Error('User is not currently logged in'));
  }
}
