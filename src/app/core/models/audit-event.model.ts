export interface AuditEvent {
  id: number;
  eventId: string;
  eventType: string;
  reservationId: string;
  previousStatus: string | null;
  newStatus: string;
  actorId: string;
  actorRole: string | null;
  unitId: number | null;
  occurredAt: string;
  recordedAt: string;
}
