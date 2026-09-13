import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Amenity, CatalogUnit, CreateCatalogUnitRequest, UpdateCatalogUnitRequest } from '../models/catalog-unit.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly baseUrl = `${environment.bffUrl}/api/catalog/units`;

  constructor(private http: HttpClient) {}

  /** Lista cerrada de valores agregados validos, tal como los define el backend (enum Amenity). */
  listAmenities(): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(`${environment.bffUrl}/api/catalog/amenities`);
  }

  list(filters: { type?: string; active?: boolean } = {}): Observable<CatalogUnit[]> {
    let params = new HttpParams();
    if (filters.type) params = params.set('type', filters.type);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    return this.http.get<CatalogUnit[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<CatalogUnit> {
    return this.http.get<CatalogUnit>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateCatalogUnitRequest): Observable<CatalogUnit> {
    return this.http.post<CatalogUnit>(this.baseUrl, request);
  }

  update(id: number, request: UpdateCatalogUnitRequest): Observable<CatalogUnit> {
    return this.http.put<CatalogUnit>(`${this.baseUrl}/${id}`, request);
  }
}
