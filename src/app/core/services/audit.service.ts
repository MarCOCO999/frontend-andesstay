import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditEvent } from '../models/audit-event.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly baseUrl = `${environment.bffUrl}/api/audit`;

  constructor(private http: HttpClient) {}

  search(filters: { reservationId?: string; actorId?: string; type?: string; from?: string; to?: string } = {}): Observable<AuditEvent[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params = params.set(key, value);
    });
    return this.http.get<AuditEvent[]>(`${this.baseUrl}/events`, { params });
  }
}
