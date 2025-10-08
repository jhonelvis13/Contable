// src/app/core/models/socio.model.ts
export interface Socio {
  id?: number;
  nombre: string;
  ciNit: string;
  direccion: string;
  telefono: string;
  email?: string;
  porcentajeParticipacion: number;
  activo: boolean;
  totalPagado?: number;
  totalPendiente?: number;
  cantidadViajes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocioFilters {
  nombre?: string;
  ciNit?: string;
  activo?: boolean;
}
