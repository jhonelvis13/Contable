// src/app/core/models/anticipo.model.ts
export interface Anticipo {
  id?: number;
  tipo: 'Empresa' | 'Socio';
  beneficiario: string; // Nombre del beneficiario
  viajeId?: number;
  viajeDescripcion?: string;
  socioId?: number;
  socioNombre?: string;
  monto: number;
  montoTotal: number; // Alias para monto
  fecha: Date;
  fechaSolicitud: Date; // Alias para fecha
  estado: 'Pendiente' | 'Pagado' | 'Parcial';
  montoPagado?: number;
  montoPendiente?: number;
  metodoPago: 'Efectivo' | 'Transferencia' | 'Cheque';
  comprobante?: string;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnticipoFilters {
  tipo?: string;
  estado?: string;
  viajeId?: number;
  socioId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
}
