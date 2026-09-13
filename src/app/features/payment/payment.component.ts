import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ReservationsService } from '../../core/services/reservations.service';
import { PAYMENT_METHOD_LABELS, PaymentMethod, Reservation } from '../../core/models/reservation.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  reservation: Reservation | null = null;
  methodLabels = PAYMENT_METHOD_LABELS;
  methods: PaymentMethod[] = ['TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'EFECTIVO'];
  selectedMethod: PaymentMethod = 'TARJETA_CREDITO';

  loading = true;
  processing = false;
  errorMessage = '';
  paidReservation: Reservation | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationsService: ReservationsService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.reservationsService.getById(id).subscribe({
      next: (reservation) => {
        if (reservation.paid) {
          // Ya esta pagada (p.ej. abierta dos veces): igual mostramos el comprobante existente.
          this.paidReservation = reservation;
        }
        this.reservation = reservation;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage =
          err.status === 403 ? 'No tienes permiso para pagar esta reserva.' : 'No se pudo cargar la reserva.';
        this.loading = false;
      },
    });
  }

  confirmPayment(): void {
    if (!this.reservation || this.processing) return;
    this.processing = true;
    this.errorMessage = '';
    // Simulacion visual: no hay pasarela de pago real integrada, solo se recrea la espera de un cobro.
    setTimeout(() => {
      this.reservationsService.pay(this.reservation!.id, this.selectedMethod).subscribe({
        next: (updated) => {
          this.paidReservation = updated;
          this.processing = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message ?? 'No se pudo procesar el pago.';
          this.processing = false;
        },
      });
    }, 900);
  }

  goToDetail(): void {
    if (this.reservation) {
      this.router.navigate(['/reservations', this.reservation.id]);
    }
  }
}
