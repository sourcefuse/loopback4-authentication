import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {Profile, Strategy, VerifiedCallback} from 'passport-saml';
import {
  SamlConfig,
  StrategyOptions,
} from 'passport-saml/lib/passport-saml/types';
import {AuthErrorKeys} from '../../error-keys';
import {Strategies} from '../../keys';
import {VerifyFunction} from '../../types';

export interface SamlStrategyFactory {
  // sonarignore:start
  (options: StrategyOptions, verifierPassed?: VerifyFunction.SamlFn): Strategy;
}
// sonarignore:end

export class SamlStrategyFactoryProvider
  implements Provider<SamlStrategyFactory>
{
  constructor(
    @inject(Strategies.SAML_VERIFIER)
    private readonly verifierSaml: VerifyFunction.SamlFn,
  ) {}

  value(): SamlStrategyFactory {
    return (options, verifier) =>
      this.getSamlStrategyVerifier(options, verifier);
  }

  getSamlStrategyVerifier(
    options: StrategyOptions,
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
        options as SamlConfig,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        func,
      );
    } else {
      strategy = new Strategy(
        options as SamlConfig,
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

  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _setupProxy(strategy: any) {
    // sonarignore:end
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
