import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  sessionExpired = false;

  constructor(
    private msalService: MsalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.sessionExpired = this.route.snapshot.queryParamMap.get('sessionExpired') === 'true';
    if (!this.sessionExpired && this.msalService.instance.getActiveAccount()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  login(): void {
    this.msalService.loginRedirect({ scopes: [environment.apiScope] });
  }

  /** Mismo login de Azure AD, pero al volver lleva directo al formulario de registro de datos. */
  register(): void {
    this.msalService.loginRedirect({
      scopes: [environment.apiScope],
      redirectStartPage: `${window.location.origin}/profile?onboarding=true`,
    });
  }
}
