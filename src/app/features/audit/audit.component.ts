import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../core/services/audit.service';
import { AuditEvent } from '../../core/models/audit-event.model';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
})
export class AuditComponent implements OnInit {
  events: AuditEvent[] = [];
  loading = true;
  errorMessage = '';

  filters = {
    reservationId: '',
    actorId: '',
    type: '',
  };

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.errorMessage = '';
    const params = {
      reservationId: this.filters.reservationId || undefined,
      actorId: this.filters.actorId || undefined,
      type: this.filters.type || undefined,
    };
    this.auditService.search(params).subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el timeline de auditoría.';
        this.loading = false;
      },
    });
  }
}
