import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './core/auth/role.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [MsalGuard],
    canActivateChild: [MsalGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/reservations/reservations.component').then((m) => m.ReservationsComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operador', 'Cliente'] },
      },
      {
        path: 'reservations/:id',
        loadComponent: () =>
          import('./features/reservation-detail/reservation-detail.component').then((m) => m.ReservationDetailComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operador', 'Cliente'] },
      },
      {
        path: 'reservations/:id/pay',
        loadComponent: () => import('./features/payment/payment.component').then((m) => m.PaymentComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operador', 'Cliente'] },
      },
      {
        path: 'catalog',
        loadComponent: () => import('./features/catalog/catalog.component').then((m) => m.CatalogComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Operador'] },
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/audit/audit.component').then((m) => m.AuditComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Auditor'] },
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
