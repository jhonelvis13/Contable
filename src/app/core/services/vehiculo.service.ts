import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private vehiculos: Vehiculo[] = [
    {
      id: 1,
      placa: 'BOL-1234',
      marca: 'Toyota',
      modelo: 'HiAce',
      year: 2020,
      tipo: 'MINIBUS',
      capacidad: 14,
      color: 'Blanco',
      conductorId: 1,
      conductorNombre: 'Juan Pérez',
      estado: 'ACTIVO',
      seguro: {
        compania: 'SOAT Nacional',
        numero: 'SO-123456789',
        fechaVencimiento: new Date('2024-12-31'),
        monto: 150
      },
      revisionTecnica: {
        numero: 'RT-987654321',
        fechaVencimiento: new Date('2024-11-15'),
        estado: 'VIGENTE'
      },
      fechaRegistro: new Date('2023-01-15'),
      observaciones: 'Vehículo en excelente estado'
    },
    {
      id: 2,
      placa: 'BOL-5678',
      marca: 'Mercedes-Benz',
      modelo: 'Sprinter',
      year: 2019,
      tipo: 'MICROBUS',
      capacidad: 20,
      color: 'Azul',
      conductorId: 2,
      conductorNombre: 'Carlos Mendoza',
      estado: 'ACTIVO',
      seguro: {
        compania: 'La Boliviana Ciacruz',
        numero: 'LBC-555444333',
        fechaVencimiento: new Date('2024-10-20'),
        monto: 200
      },
      revisionTecnica: {
        numero: 'RT-111222333',
        fechaVencimiento: new Date('2024-09-30'),
        estado: 'VIGENTE'
      },
      fechaRegistro: new Date('2023-02-20'),
      observaciones: 'Mantenimiento programado cada 3 meses'
    },
    {
      id: 3,
      placa: 'BOL-9012',
      marca: 'Chevrolet',
      modelo: 'NPR',
      year: 2021,
      tipo: 'CAMION',
      capacidad: 5,
      color: 'Rojo',
      conductorId: 3,
      conductorNombre: 'Ana Quispe',
      estado: 'MANTENIMIENTO',
      seguro: {
        compania: 'Nacional Vida',
        numero: 'NV-777888999',
        fechaVencimiento: new Date('2024-08-15'),
        monto: 180
      },
      revisionTecnica: {
        numero: 'RT-444555666',
        fechaVencimiento: new Date('2024-07-10'),
        estado: 'VENCIDO'
      },
      fechaRegistro: new Date('2023-03-10'),
      observaciones: 'En taller por reparación de motor'
    },
    {
      id: 4,
      placa: 'BOL-3456',
      marca: 'Hyundai',
      modelo: 'County',
      year: 2018,
      tipo: 'AUTOBUS',
      capacidad: 30,
      color: 'Verde',
      conductorId: null,
      conductorNombre: null,
      estado: 'DISPONIBLE',
      seguro: {
        compania: 'Credinform',
        numero: 'CR-123789456',
        fechaVencimiento: new Date('2024-06-30'),
        monto: 250
      },
      revisionTecnica: {
        numero: 'RT-789123456',
        fechaVencimiento: new Date('2024-05-20'),
        estado: 'VENCIDO'
      },
      fechaRegistro: new Date('2023-04-05'),
      observaciones: 'Vehículo sin conductor asignado'
    },
    {
      id: 5,
      placa: 'BOL-7890',
      marca: 'Ford',
      modelo: 'Transit',
      year: 2022,
      tipo: 'MINIBUS',
      capacidad: 12,
      color: 'Gris',
      conductorId: 4,
      conductorNombre: 'Roberto Silva',
      estado: 'ACTIVO',
      seguro: {
        compania: 'SOAT Nacional',
        numero: 'SO-987654123',
        fechaVencimiento: new Date('2025-01-15'),
        monto: 170
      },
      revisionTecnica: {
        numero: 'RT-654321789',
        fechaVencimiento: new Date('2025-02-28'),
        estado: 'VIGENTE'
      },
      fechaRegistro: new Date('2023-05-12'),
      observaciones: 'Vehículo más reciente de la flota'
    }
  ];

  getVehiculos(): Observable<Vehiculo[]> {
    return of(this.vehiculos);
  }

  getVehiculoById(id: number): Observable<Vehiculo | undefined> {
    const vehiculo = this.vehiculos.find(v => v.id === id);
    return of(vehiculo);
  }

  getVehiculosByEstado(estado: string): Observable<Vehiculo[]> {
    const vehiculosFiltrados = this.vehiculos.filter(v => v.estado === estado);
    return of(vehiculosFiltrados);
  }

  getVehiculosByTipo(tipo: string): Observable<Vehiculo[]> {
    const vehiculosFiltrados = this.vehiculos.filter(v => v.tipo === tipo);
    return of(vehiculosFiltrados);
  }

  getVehiculosDisponibles(): Observable<Vehiculo[]> {
    const vehiculosDisponibles = this.vehiculos.filter(v => 
      v.estado === 'ACTIVO' || v.estado === 'DISPONIBLE'
    );
    return of(vehiculosDisponibles);
  }

  createVehiculo(vehiculo: Omit<Vehiculo, 'id'>): Observable<Vehiculo> {
    const newId = Math.max(...this.vehiculos.map(v => v.id || 0)) + 1;
    const newVehiculo: Vehiculo = {
      ...vehiculo,
      id: newId,
      fechaRegistro: new Date()
    };
    this.vehiculos.push(newVehiculo);
    return of(newVehiculo);
  }

  updateVehiculo(id: number, vehiculo: Partial<Vehiculo>): Observable<Vehiculo | null> {
    const index = this.vehiculos.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehiculos[index] = { ...this.vehiculos[index], ...vehiculo };
      return of(this.vehiculos[index]);
    }
    return of(null);
  }

  deleteVehiculo(id: number): Observable<boolean> {
    const index = this.vehiculos.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehiculos.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  asignarConductor(vehiculoId: number, conductorId: number, conductorNombre: string): Observable<boolean> {
    const vehiculo = this.vehiculos.find(v => v.id === vehiculoId);
    if (vehiculo) {
      vehiculo.conductorId = conductorId;
      vehiculo.conductorNombre = conductorNombre;
      vehiculo.estado = 'ACTIVO';
      return of(true);
    }
    return of(false);
  }

  desasignarConductor(vehiculoId: number): Observable<boolean> {
    const vehiculo = this.vehiculos.find(v => v.id === vehiculoId);
    if (vehiculo) {
      vehiculo.conductorId = null;
      vehiculo.conductorNombre = null;
      vehiculo.estado = 'DISPONIBLE';
      return of(true);
    }
    return of(false);
  }

  getEstadisticas(): Observable<any> {
    const total = this.vehiculos.length;
    const activos = this.vehiculos.filter(v => v.estado === 'ACTIVO').length;
    const disponibles = this.vehiculos.filter(v => v.estado === 'DISPONIBLE').length;
    const mantenimiento = this.vehiculos.filter(v => v.estado === 'MANTENIMIENTO').length;
    
    const segurosPorVencer = this.vehiculos.filter(v => {
      const fechaVencimiento = new Date(v.seguro.fechaVencimiento);
      const hoy = new Date();
      const diferencia = fechaVencimiento.getTime() - hoy.getTime();
      const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
      return diasRestantes <= 30 && diasRestantes >= 0;
    }).length;

    const revisionesPorVencer = this.vehiculos.filter(v => {
      const fechaVencimiento = new Date(v.revisionTecnica.fechaVencimiento);
      const hoy = new Date();
      const diferencia = fechaVencimiento.getTime() - hoy.getTime();
      const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
      return diasRestantes <= 30 && diasRestantes >= 0;
    }).length;

    return of({
      total,
      activos,
      disponibles,
      mantenimiento,
      segurosPorVencer,
      revisionesPorVencer
    });
  }
}