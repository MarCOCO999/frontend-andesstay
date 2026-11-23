/** Datos del huesped: perfil de registro del cliente y datos ingresados en el meson por Operador/Admin. */
export interface GuestDetails {
  fullName: string;
  documentId: string;
  phone: string;
  country: string;
  email: string;
}

export function emptyGuestDetails(): GuestDetails {
  return { fullName: '', documentId: '', phone: '', country: '', email: '' };
}
