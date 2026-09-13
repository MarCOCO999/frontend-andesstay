import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { CatalogService } from '../../core/services/catalog.service';
import { UnitPhotoComponent } from '../../core/components/unit-photo/unit-photo.component';
import {
  NEXT_STATUS,
  PAYMENT_TIMING_LABELS,
  PaymentTiming,
  Reservation,
  ReservationStatus,
} from '../../core/models/reservation.model';
import { AMENITY_LABELS, CatalogUnit } from '../../core/models/catalog-unit.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UnitPhotoComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  catalogUnits: CatalogUnit[] = [];
  amenityLabels = AMENITY_LABELS;
  paymentTimingLabels = PAYMENT_TIMING_LABELS;
  selectedUnitId: number | null = null;
  loading = true;
  loadingUnits = true;
  errorMessage = '';
  successMessage = '';

  draft = {
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    paymentTiming: 'CHECKIN' as PaymentTiming,
  };

  constructor(
    public currentUser: CurrentUserService,
    private reservationsService: ReservationsService,
    private catalogService: CatalogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.reload();
    this.catalogService.list({ active: true }).subscribe({
      next: (units) => {
        this.catalogUnits = units;
        this.loadingUnits = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las unidades disponibles.';
        this.loadingUnits = false;
      },
    });
  }

  get canChangeStatus(): boolean {
    return this.currentUser.hasAnyRole('Admin', 'Operador');
  }

  get selectedUnit(): CatalogUnit | undefined {
    return this.catalogUnits.find((u) => u.id === this.selectedUnitId);
  }

  get canSubmit(): boolean {
    return !!this.selectedUnitId && !!this.draft.checkInDate && !!this.draft.checkOutDate && this.draft.guestCount > 0;
  }

  /** Solo para mostrarle al usuario una referencia antes de enviar; el monto real lo calcula el backend con la tarifa vigente. */
  get estimatedNights(): number {
    if (!this.draft.checkInDate || !this.draft.checkOutDate) {
      return 0;
    }
    const nights = (new Date(this.draft.checkOutDate).getTime() - new Date(this.draft.checkInDate).getTime()) / 86_400_000;
    return nights > 0 ? Math.round(nights) : 0;
  }

  get estimatedTotal(): number | null {
    if (!this.selectedUnit || this.estimatedNights === 0) {
      return null;
    }
    return this.selectedUnit.nightlyRate * this.estimatedNights;
  }

  reload(): void {
    this.loading = true;
    this.reservationsService.list().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las reservas.';
        this.loading = false;
      },
    });
  }

  nextStatuses(reservation: Reservation): ReservationStatus[] {
    return NEXT_STATUS[reservation.status] ?? [];
  }

  selectUnit(unit: CatalogUnit): void {
    if (!unit.active || unit.availableUnits <= 0) {
      return;
    }
    this.selectedUnitId = this.selectedUnitId === unit.id ? null : unit.id;
  }

  create(): void {
    if (!this.selectedUnitId) {
      return;
    }
    this.clearMessages();
    const payNow = this.draft.paymentTiming === 'INMEDIATO';
    this.reservationsService
      .create({ unitId: this.selectedUnitId, ...this.draft })
      .subscribe({
        next: (created) => {
          if (payNow) {
            this.router.navigate(['/reservations', created.id, 'pay']);
            return;
          }
          this.successMessage = `Reserva creada correctamente. Monto total: $${created.totalAmount.toLocaleString('es-CL')}.`;
          this.selectedUnitId = null;
          this.draft = { checkInDate: '', checkOutDate: '', guestCount: 1, paymentTiming: 'CHECKIN' };
          this.reload();
        },
        error: (err: HttpErrorResponse) => this.showError(err, 'No se pudo crear la reserva.'),
      });
  }

  changeStatus(reservation: Reservation, status: ReservationStatus): void {
    this.clearMessages();
    this.reservationsService.updateStatus(reservation.id, status).subscribe({
      next: () => {
        this.successMessage = `Reserva ${reservation.id} actualizada a ${status}.`;
        this.reload();
      },
      error: (err: HttpErrorResponse) => this.showError(err, 'No se pudo cambiar el estado de la reserva.'),
    });
  }

  private showError(err: HttpErrorResponse, fallback: string): void {
    this.errorMessage = err.error?.message ?? fallback;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
