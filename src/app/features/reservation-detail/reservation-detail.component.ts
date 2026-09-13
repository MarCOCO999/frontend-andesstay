import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { CatalogService } from '../../core/services/catalog.service';
import { UnitPhotoComponent } from '../../core/components/unit-photo/unit-photo.component';
import {
  NEXT_STATUS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_TIMING_LABELS,
  Reservation,
  ReservationStatus,
} from '../../core/models/reservation.model';
import { AMENITY_LABELS, CatalogUnit } from '../../core/models/catalog-unit.model';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, UnitPhotoComponent],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.scss',
})
export class ReservationDetailComponent implements OnInit {
  reservation: Reservation | null = null;
  unit: CatalogUnit | null = null;
  amenityLabels = AMENITY_LABELS;
  paymentTimingLabels = PAYMENT_TIMING_LABELS;
  paymentMethodLabels = PAYMENT_METHOD_LABELS;
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    public currentUser: CurrentUserService,
    private route: ActivatedRoute,
    private reservationsService: ReservationsService,
    private catalogService: CatalogService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.reservationsService.getById(id).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.catalogService.getById(reservation.unitId).subscribe({
          next: (unit) => {
            this.unit = unit;
            this.loading = false;
          },
          error: () => {
            // El detalle de la reserva sigue siendo util aunque no se pueda mostrar la unidad.
            this.loading = false;
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage =
          err.status === 403
            ? 'No tienes permiso para ver el detalle de esta reserva.'
            : 'No se pudo cargar la reserva.';
        this.loading = false;
      },
    });
  }

  get canChangeStatus(): boolean {
    return this.currentUser.hasAnyRole('Admin', 'Operador');
  }

  get nextStatuses(): ReservationStatus[] {
    return this.reservation ? (NEXT_STATUS[this.reservation.status] ?? []) : [];
  }

  changeStatus(status: ReservationStatus): void {
    if (!this.reservation) return;
    this.reservationsService.updateStatus(this.reservation.id, status).subscribe({
      next: (updated) => {
        this.reservation = updated;
        this.successMessage = `Estado actualizado a ${status}.`;
      },
      error: (err: HttpErrorResponse) => this.showError(err),
    });
  }

  private showError(err: HttpErrorResponse): void {
    this.errorMessage = err.error?.message ?? 'No se pudo completar la acción.';
  }
}
