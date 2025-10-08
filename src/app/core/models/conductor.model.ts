// src/app/core/models/conductor.model.ts
export interface Licencia {
  numero: string;
  categoria: 'A' | 'B' | 'C' | 'D' | 'E';
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA';
}

export interface VehiculoAsignado {
  id: number;
  placa: string;
}

export interface Conductor {
  id?: number;
  nombre: string;
  apellido: string;
  ci: string;
  fechaNacimiento: Date;
  telefono: string;
  email?: string;
  direccion: string;
  licencia: Licencia;
  vehiculoAsignado?: VehiculoAsignado | null;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'LICENCIA_MEDICA' | 'INACTIVO';
  fechaIngreso?: Date;
  observaciones?: string;
}

export interface ConductorFilters {
  nombre?: string;
  apellido?: string;
  ci?: string;
  estado?: string;
  categoria?: string;
  vehiculoAsignado?: boolean;
}
