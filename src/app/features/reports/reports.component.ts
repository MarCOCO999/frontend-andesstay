import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { KpisResponse, TopUnitResponse } from '../../core/models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  kpis: KpisResponse | null = null;
  topUnits: TopUnitResponse[] = [];
  loading = true;
  errorMessage = '';
  kpisRange = 'last24h';
  topUnitsRange = 'last7d';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reloadAll();
  }

  reloadAll(): void {
    this.loading = true;
    this.errorMessage = '';
    this.reportService.kpis(this.kpisRange).subscribe({
      next: (kpis) => (this.kpis = kpis),
      error: () => (this.errorMessage = 'No se pudieron cargar los KPIs.'),
    });
    this.reportService.topUnits(this.topUnitsRange).subscribe({
      next: (units) => {
        this.topUnits = units;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las unidades más demandadas.';
        this.loading = false;
      },
    });
  }
}
