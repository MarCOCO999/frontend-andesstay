export type ReservationStatus =
  | 'CREADA'
  | 'CONFIRMADA'
  | 'CHECKIN_PENDIENTE'
  | 'EN_ESTADÍA'
  | 'CHECKOUT'
  | 'CANCELADA';

export type PaymentTiming = 'INMEDIATO' | 'CHECKIN';

export const PAYMENT_TIMING_LABELS: Record<PaymentTiming, string> = {
  INMEDIATO: 'Pagar ahora',
  CHECKIN: 'Pagar al hacer check-in',
};

export type PaymentMethod = 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA' | 'EFECTIVO';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  TARJETA_CREDITO: 'Tarjeta de crédito',
  TARJETA_DEBITO: 'Tarjeta de débito',
  TRANSFERENCIA: 'Transferencia',
  EFECTIVO: 'Efectivo',
};

export interface Reservation {
  id: number;
  guestId: string;
  unitId: number;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  status: ReservationStatus;
  totalAmount: number;
  paymentTiming: PaymentTiming;
  paid: boolean;
  paymentMethod: PaymentMethod | null;
  transactionId: string | null;
  paidAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  unitId: number;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  paymentTiming: PaymentTiming;
}

/** Transiciones validas del estado de una reserva (misma maquina de estados que el backend). */
export const NEXT_STATUS: Partial<Record<ReservationStatus, ReservationStatus[]>> = {
  CREADA: ['CONFIRMADA', 'CANCELADA'],
  CONFIRMADA: ['CHECKIN_PENDIENTE', 'CANCELADA'],
  CHECKIN_PENDIENTE: ['EN_ESTADÍA', 'CANCELADA'],
  'EN_ESTADÍA': ['CHECKOUT'],
};
