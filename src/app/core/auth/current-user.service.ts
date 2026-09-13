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

  logout(): void {
    this.msalService.logoutRedirect();
  }
}
