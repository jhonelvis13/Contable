// src/app/core/models/viaje.model.ts
export interface Viaje {
  id?: number;
  tipo: 'Nacional' | 'Internacional';
  clienteId: number;
  clienteNombre?: string;
  producto: string;
  montoTotal: number;
  anticipo: number;
  montoPendiente: number;
  conductorId: number;
  conductorNombre?: string;
  vehiculoId: number;
  vehiculoPlaca?: string;
  estado: 'Pendiente' | 'En curso' | 'Finalizado' | 'Cancelado';
  fechaInicio?: Date;
  fechaFin?: Date;
  origen?: string;
  destino?: string;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ViajeFilters {
  tipo?: string;
  clienteId?: number;
  estado?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}
