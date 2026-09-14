import { Component, Input } from '@angular/core';
import { UnitType } from '../../models/catalog-unit.model';

/**
 * Ilustracion + badge de tipo, compartida entre el catalogo (gestion) y el selector de
 * unidades al reservar. Ver public/images/README.md para reemplazarla por fotografia real.
 */
@Component({
  selector: 'app-unit-photo',
  standalone: true,
  templateUrl: './unit-photo.component.html',
  styleUrl: './unit-photo.component.scss',
})
export class UnitPhotoComponent {
  @Input({ required: true }) type!: UnitType;
  /** Foto real subida por un Admin; si es null se usa la ilustracion generica del tipo. */
  @Input() imageUrl: string | null = null;
}
