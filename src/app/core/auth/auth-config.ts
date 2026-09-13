import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureAd.clientId,
      authority: environment.azureAd.authority,
      redirectUri: environment.azureAd.redirectUri,
      postLogoutRedirectUri: environment.azureAd.postLogoutRedirectUri,
    },
    cache: {
      // LocalStorage (en vez de SessionStorage, el default) para que la sesion
      // sobreviva a cerrar la pestana, igual que un login corporativo tradicional.
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      loggerOptions: {
        logLevel: environment.production ? LogLevel.Warning : LogLevel.Info,
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          if (level === LogLevel.Error) {
            console.error(message);
          }
        },
      },
    },
  });
}

/** MsalGuard: como se pide el token cuando una ruta protegida requiere iniciar sesion. */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [environment.apiScope],
    },
    loginFailedRoute: '/login',
  };
}

/**
 * MsalInterceptor: adjunta automaticamente "Authorization: Bearer <access_token>" a toda
 * llamada HTTP cuya URL matchee el protectedResourceMap. Sin esto habria que agregar el
 * header a mano en cada servicio.
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string> | null>();
  protectedResourceMap.set(`${environment.bffUrl}/*`, [environment.apiScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
