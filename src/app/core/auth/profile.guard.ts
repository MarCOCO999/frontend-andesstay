import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { CurrentUserService } from './current-user.service';
import { ProfileService } from '../services/profile.service';

/**
 * Registro obligatorio: un Cliente que entra por primera vez (sin perfil en el backend) es
 * llevado a /profile para completar sus datos antes de usar el resto de la aplicacion.
 * Operador/Admin/Auditor no lo necesitan: trabajan con los datos de los huespedes.
 */
export const profileGuard: CanActivateChildFn = (childRoute, state) => {
  const currentUser = inject(CurrentUserService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  if (childRoute.routeConfig?.path === 'profile' || !currentUser.isGuestOnly) {
    return true;
  }
  return profileService.getMine().pipe(
    map((profile) =>
      profile ? true : router.createUrlTree(['/profile'], { queryParams: { onboarding: 'true', returnUrl: state.url } }),
    ),
    // Si el backend no responde no se bloquea la navegacion: cada vista ya muestra su propio error.
    catchError(() => of(true)),
  );
};
