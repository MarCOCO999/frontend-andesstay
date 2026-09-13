import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { catchError, throwError } from 'rxjs';

/**
 * Si el BFF/microservicio responde 401 (token vencido, revocado o invalido), la sesion
 * local de MSAL queda "viva" pero inutil: sin esto, el usuario se queda viendo una pantalla
 * rota sin saber que debe volver a iniciar sesion.
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        msalService.instance.setActiveAccount(null);
        router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
      }
      return throwError(() => error);
    }),
  );
};
