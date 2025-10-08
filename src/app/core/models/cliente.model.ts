// src/app/core/models/cliente.model.ts
export interface Cliente {
  id?: number;
  nombre: string;
  nit: string;
  direccion: string;
  telefono: string;
  email?: string;
  contacto: string;
  tipo: 'Empresa' | 'Particular';
  activo: boolean;
  totalFacturado?: number;
  cantidadViajes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClienteFilters {
  nombre?: string;
  nit?: string;
  tipo?: string;
  activo?: boolean;
}
