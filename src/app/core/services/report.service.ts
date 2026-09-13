import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KpisResponse, TopUnitResponse } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly baseUrl = `${environment.bffUrl}/api/report`;

  constructor(private http: HttpClient) {}

  kpis(range = 'last24h'): Observable<KpisResponse> {
    return this.http.get<KpisResponse>(`${this.baseUrl}/kpis`, { params: new HttpParams().set('range', range) });
  }

  topUnits(range = 'last7d', limit = 10): Observable<TopUnitResponse[]> {
    const params = new HttpParams().set('range', range).set('limit', String(limit));
    return this.http.get<TopUnitResponse[]>(`${this.baseUrl}/top-units`, { params });
  }
}
