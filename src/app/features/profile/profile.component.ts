import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { ProfileService } from '../../core/services/profile.service';
import { GuestDetails, emptyGuestDetails } from '../../core/models/guest-profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  details: GuestDetails = emptyGuestDetails();
  /** Primer ingreso: el usuario llego aqui redirigido por el profileGuard. */
  onboarding = false;
  isNew = true;
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  private returnUrl = '/dashboard';

  constructor(
    private currentUser: CurrentUserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.onboarding = params.get('onboarding') === 'true';
    this.returnUrl = params.get('returnUrl') ?? '/dashboard';

    this.profileService.getMine().subscribe({
      next: (profile) => {
        if (profile) {
          this.details = { ...profile };
          this.isNew = false;
        } else {
          // Se precarga lo que ya trae la cuenta de Azure AD para no pedirlo dos veces.
          this.details = { ...emptyGuestDetails(), fullName: this.currentUser.displayName, email: this.currentUser.email };
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar tu perfil.';
        this.loading = false;
      },
    });
  }

  save(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.saving = true;
    this.profileService.saveMine(this.details).subscribe({
      next: (saved) => {
        this.details = { ...saved };
        this.saving = false;
        if (this.onboarding) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }
        this.isNew = false;
        this.successMessage = 'Tus datos se guardaron correctamente.';
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.errorMessage = err.error?.message ?? 'No se pudieron guardar tus datos.';
      },
    });
  }
}
