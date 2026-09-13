import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { ReportService } from '../../core/services/report.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { KpisResponse } from '../../core/models/report.model';
import { Reservation } from '../../core/models/reservation.model';

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
  loading = true;
  errorMessage = '';
  accessDeniedSection: string | null = null;

  constructor(
    public currentUser: CurrentUserService,
    private reportService: ReportService,
    private reservationsService: ReservationsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.accessDeniedSection = this.route.snapshot.queryParamMap.get('accessDenied');

    if (this.currentUser.hasRole('Admin')) {
      this.reportService.kpis('last24h').subscribe({
        next: (kpis) => {
          this.kpis = kpis;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'No se pudieron cargar los KPIs.';
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
}
