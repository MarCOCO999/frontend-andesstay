import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { CatalogService } from '../../core/services/catalog.service';
import { UnitPhotoComponent } from '../../core/components/unit-photo/unit-photo.component';
import {
  AMENITY_LABELS,
  Amenity,
  CatalogUnit,
  CreateCatalogUnitRequest,
  UpdateCatalogUnitRequest,
} from '../../core/models/catalog-unit.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, UnitPhotoComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  units: CatalogUnit[] = [];
  availableAmenities: Amenity[] = [];
  amenityLabels = AMENITY_LABELS;
  loading = true;
  errorMessage = '';
  successMessage = '';
  editingId: number | null = null;
  editForm: UpdateCatalogUnitRequest = { nightlyRate: 0, availableUnits: 0, active: true, amenities: [] };

  newUnit: CreateCatalogUnitRequest = {
    code: '',
    type: 'HABITACION',
    capacity: 2,
    nightlyRate: 0,
    totalUnits: 1,
    amenities: [],
  };

  constructor(
    public currentUser: CurrentUserService,
    private catalogService: CatalogService,
  ) {}

  ngOnInit(): void {
    this.catalogService.listAmenities().subscribe({
      next: (amenities) => (this.availableAmenities = amenities),
      error: () => {
        // La lista de amenities no es critica para ver el catalogo; solo afecta el formulario.
      },
    });
    this.reload();
  }

  get canManage(): boolean {
    return this.currentUser.hasRole('Admin');
  }

  reload(): void {
    this.loading = true;
    this.catalogService.list().subscribe({
      next: (units) => {
        this.units = units;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las unidades.';
        this.loading = false;
      },
    });
  }

  isSelected(list: Amenity[], amenity: Amenity): boolean {
    return list.includes(amenity);
  }

  toggleAmenity(list: Amenity[], amenity: Amenity): Amenity[] {
    return list.includes(amenity) ? list.filter((a) => a !== amenity) : [...list, amenity];
  }

  toggleNewUnitAmenity(amenity: Amenity): void {
    this.newUnit.amenities = this.toggleAmenity(this.newUnit.amenities, amenity);
  }

  toggleEditAmenity(amenity: Amenity): void {
    this.editForm.amenities = this.toggleAmenity(this.editForm.amenities, amenity);
  }

  create(): void {
    this.clearMessages();
    this.catalogService.create(this.newUnit).subscribe({
      next: () => {
        this.successMessage = 'Unidad creada correctamente.';
        this.newUnit = { code: '', type: 'HABITACION', capacity: 2, nightlyRate: 0, totalUnits: 1, amenities: [] };
        this.reload();
      },
      error: (err: HttpErrorResponse) => this.showError(err, 'No se pudo crear la unidad.'),
    });
  }

  startEdit(unit: CatalogUnit): void {
    this.editingId = unit.id;
    this.editForm = {
      nightlyRate: unit.nightlyRate,
      availableUnits: unit.availableUnits,
      active: unit.active,
      amenities: [...unit.amenities],
    };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(unit: CatalogUnit): void {
    this.clearMessages();
    this.catalogService.update(unit.id, this.editForm).subscribe({
      next: () => {
        this.successMessage = `Unidad ${unit.code} actualizada.`;
        this.editingId = null;
        this.reload();
      },
      error: (err: HttpErrorResponse) => this.showError(err, 'No se pudo actualizar la unidad.'),
    });
  }

  private showError(err: HttpErrorResponse, fallback: string): void {
    this.errorMessage = err.error?.message ?? fallback;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
