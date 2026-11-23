import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  constructor(private msalService: MsalService) {}

  get displayName(): string {
    const account = this.msalService.instance.getActiveAccount();
    return (account?.idTokenClaims?.['name'] as string | undefined) ?? account?.username ?? '';
  }

  get email(): string {
    const account = this.msalService.instance.getActiveAccount();
    return (account?.idTokenClaims?.['preferred_username'] as string | undefined) ?? account?.username ?? '';
  }

  get roles(): string[] {
    const account = this.msalService.instance.getActiveAccount();
    return (account?.idTokenClaims?.['roles'] as string[] | undefined) ?? [];
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(...roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /** Cliente sin rol de Operador/Admin: reserva para si mismo, con los datos de su perfil. */
  get isGuestOnly(): boolean {
    return this.hasRole('Cliente') && !this.hasAnyRole('Admin', 'Operador');
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }
}
