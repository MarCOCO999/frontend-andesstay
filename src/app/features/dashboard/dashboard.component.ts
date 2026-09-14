import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { ReportService } from '../../core/services/report.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { KpisResponse } from '../../core/models/report.model';
import { Reservation, ReservationStatus } from '../../core/models/reservation.model';

interface ReservationStatusSummary {
  total: number;
  pending: number;
  cancelled: number;
  checkedOut: number;
}

/** Estados en los que la reserva todavia esta "en curso" (ni cancelada ni con checkout hecho). */
const PENDING_STATUSES: ReservationStatus[] = ['CREADA', 'CONFIRMADA', 'CHECKIN_PENDIENTE', 'EN_ESTADÍA'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  kpis: KpisResponse | null = null;
  myReservations: Reservation[] = [];
  statusSummary: ReservationStatusSummary = { total: 0, pending: 0, cancelled: 0, checkedOut: 0 };
  loading = true;
  errorMessage = '';
  accessDeniedSection: string | null = null;

  constructor(
    public currentUser: CurrentUserService,
    private reportService: ReportService,
    private reservationsService: ReservationsService,
    private route: ActivatedRoute,
  ) {}

  get isStaff(): boolean {
    return this.currentUser.hasAnyRole('Admin', 'Operador');
  }

  ngOnInit(): void {
    this.accessDeniedSection = this.route.snapshot.queryParamMap.get('accessDenied');

    if (this.isStaff) {
      // KPIs de report (ocupacion, tiempo de ciclo) son exclusivos de Admin en el backend;
      // el resumen por estado, en cambio, se calcula aqui a partir de todas las reservas,
      // asi que sirve tanto para Admin como para Operador.
      if (this.currentUser.hasRole('Admin')) {
        this.reportService.kpis('last24h').subscribe({
          next: (kpis) => (this.kpis = kpis),
          error: () => {
            // Los KPIs son un complemento; si fallan, el resumen de reservas sigue siendo util.
          },
        });
      }
      this.reservationsService.list().subscribe({
        next: (reservations) => {
          this.statusSummary = this.summarize(reservations);
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'No se pudo cargar el resumen de reservas.';
          this.loading = false;
        },
      });
      return;
    }

    this.reservationsService.list().subscribe({
      next: (reservations) => {
        this.myReservations = reservations;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar tus reservas.';
        this.loading = false;
      },
    });
  }

  private summarize(reservations: Reservation[]): ReservationStatusSummary {
    return {
      total: reservations.length,
      pending: reservations.filter((r) => PENDING_STATUSES.includes(r.status)).length,
      cancelled: reservations.filter((r) => r.status === 'CANCELADA').length,
      checkedOut: reservations.filter((r) => r.status === 'CHECKOUT').length,
    };
  }
}
