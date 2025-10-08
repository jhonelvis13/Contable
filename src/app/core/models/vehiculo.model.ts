// src/app/core/models/vehiculo.model.ts
export interface Seguro {
  compania: string;
  numero: string;
  fechaVencimiento: Date;
  monto: number;
}

export interface RevisionTecnica {
  numero: string;
  fechaVencimiento: Date;
  estado: 'VIGENTE' | 'VENCIDO' | 'PENDIENTE';
}

export interface Vehiculo {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  year: number;
  tipo: 'MINIBUS' | 'MICROBUS' | 'AUTOBUS' | 'CAMION' | 'PICKUP' | 'OTRO';
  capacidad: number;
  color: string;
  conductorId?: number | null;
  conductorNombre?: string | null;
  estado: 'ACTIVO' | 'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVO';
  seguro: Seguro;
  revisionTecnica: RevisionTecnica;
  fechaRegistro?: Date;
  observaciones?: string;
}

export interface VehiculoFilters {
  placa?: string;
  marca?: string;
  modelo?: string;
  tipo?: string;
  estado?: string;
  conductorId?: number;
  year?: number;
}
