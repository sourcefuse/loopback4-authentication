import {inject, Provider} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {
  Profile,
  Strategy,
  StrategyOption,
  StrategyOptionWithRequest,
} from 'passport-facebook';

import {AuthErrorKeys} from '../../../error-keys';
import {Strategies} from '../../keys';
import {VerifyCallback, VerifyFunction} from '../../types';

interface ExtendedStrategyOption extends StrategyOption {
  passReqToCallback?: false;
}

export type FacebookAuthStrategyFactory = (
  options: ExtendedStrategyOption | StrategyOptionWithRequest,
  verifierPassed?: VerifyFunction.FacebookAuthFn,
) => Strategy;

export class FacebookAuthStrategyFactoryProvider
  implements Provider<FacebookAuthStrategyFactory>
{
  constructor(
    @inject(Strategies.Passport.FACEBOOK_OAUTH2_VERIFIER)
    private readonly verifierFacebookAuth: VerifyFunction.FacebookAuthFn,
  ) {}

  value(): FacebookAuthStrategyFactory {
    return (options, verifier) =>
      this.getFacebookAuthStrategyVerifier(options, verifier);
  }

  getFacebookAuthStrategyVerifier(
    options: ExtendedStrategyOption | StrategyOptionWithRequest,
    verifierPassed?: VerifyFunction.FacebookAuthFn,
  ): Strategy {
    const verifyFn = verifierPassed ?? this.verifierFacebookAuth;
    let strategy;
    if (options?.passReqToCallback === true) {
      strategy = new Strategy(
        options,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          req: Request,
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          cb: VerifyCallback,
        ) => {
          try {
            const user = await verifyFn(
              accessToken,
              refreshToken,
              profile,
              cb,
              req,
            );
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(undefined, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    } else {
      strategy = new Strategy(
        options as ExtendedStrategyOption,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          cb: VerifyCallback,
        ) => {
          try {
            const user = await verifyFn(accessToken, refreshToken, profile, cb);
            if (!user) {
              throw new HttpErrors.Unauthorized(
                AuthErrorKeys.InvalidCredentials,
              );
            }
            cb(undefined, user);
          } catch (err) {
            cb(err);
          }
        },
      );
    }

    this._setupProxy(strategy);
    return strategy;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _setupProxy(strategy: any) {
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
