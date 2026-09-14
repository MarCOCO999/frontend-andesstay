import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Amenity, CatalogUnit, CreateCatalogUnitRequest, UpdateCatalogUnitRequest } from '../models/catalog-unit.model';

interface PresignImageResponse {
  uploadUrl: string;
  publicUrl: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly baseUrl = `${environment.bffUrl}/api/catalog/units`;

  constructor(private http: HttpClient) {}

  /** Lista cerrada de valores agregados validos, tal como los define el backend (enum Amenity). */
  listAmenities(): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(`${environment.bffUrl}/api/catalog/amenities`);
  }

  /**
   * Sube una foto de referencia a S3: primero pide al backend una URL prefirmada, luego
   * sube el archivo directo a S3 (nunca pasa por el backend). Devuelve la URL publica final,
   * lista para guardar como imageUrl de la unidad.
   */
  async uploadUnitImage(file: File): Promise<string> {
    const presign = await firstValueFrom(
      this.http.post<PresignImageResponse>(`${this.baseUrl}/images/presign`, {
        fileName: file.name,
        contentType: file.type,
      }),
    );
    // La URL de S3 va a otro origen (no bffUrl), asi que el interceptor de MSAL no le agrega
    // el Bearer del BFF: S3 valida su propia firma, no un JWT de Azure AD.
    await firstValueFrom(
      this.http.put(presign.uploadUrl, file, { headers: { 'Content-Type': file.type } }),
    );
    return presign.publicUrl;
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
