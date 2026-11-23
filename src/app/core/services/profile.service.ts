import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GuestDetails } from '../models/guest-profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly baseUrl = `${environment.bffUrl}/api/profile/me`;
  // Se cachea para que el profileGuard no consulte al backend en cada navegacion.
  private profile$?: Observable<GuestDetails | null>;

  constructor(private http: HttpClient) {}

  /** null = el usuario aun no completa su registro (el backend responde 404). */
  getMine(): Observable<GuestDetails | null> {
    if (!this.profile$) {
      this.profile$ = this.http.get<GuestDetails>(this.baseUrl).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            return of(null);
          }
          this.profile$ = undefined;
          return throwError(() => err);
        }),
        shareReplay(1),
      );
    }
    return this.profile$;
  }

  saveMine(details: GuestDetails): Observable<GuestDetails> {
    return this.http.put<GuestDetails>(this.baseUrl, details).pipe(tap((saved) => (this.profile$ = of(saved))));
  }
}
