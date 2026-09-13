import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

/**
 * Autorizacion por rol (Admin, Operador, Cliente, Auditor) leida desde el claim "roles"
 * del id_token/access_token de Azure AD. Se usa en app.routes.ts junto a route.data.roles.
 */
export const roleGuard: CanActivateFn = (route) => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const account = msalService.instance.getActiveAccount();
  if (!account) {
    return router.parseUrl('/login');
  }

  const userRoles = (account.idTokenClaims?.['roles'] as string[] | undefined) ?? [];
  const isAllowed = requiredRoles.some((role) => userRoles.includes(role));
  if (isAllowed) {
    return true;
  }
  // Se avisa por que se redirige, en vez de mandarlo en silencio a /dashboard.
  return router.createUrlTree(['/dashboard'], { queryParams: { accessDenied: route.routeConfig?.path } });
};
