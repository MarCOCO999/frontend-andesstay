import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateReservationRequest, PaymentMethod, Reservation, ReservationStatus } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly baseUrl = `${environment.bffUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  list(filters: { status?: string; from?: string; to?: string } = {}): Observable<Reservation[]> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);
    return this.http.get<Reservation[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, request);
  }

  updateStatus(id: number, status: ReservationStatus): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/status`, { status });
  }

  pay(id: number, method: PaymentMethod): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/${id}/pay`, { method });
  }
}
