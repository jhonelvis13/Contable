// src/app/core/services/conductor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Conductor, ConductorFilters } from '../models/conductor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  private conductores: Conductor[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      ci: '12345678',
      fechaNacimiento: new Date('1985-03-15'),
      telefono: '70123456',
      email: 'juan.perez@email.com',
      direccion: 'Av. Siempre Viva 123, La Paz',
      licencia: {
        numero: 'LIC-001234',
        categoria: 'C',
        fechaEmision: new Date('2020-01-15'),
        fechaVencimiento: new Date('2025-01-15'),
        estado: 'VIGENTE'
      },
      vehiculoAsignado: {
        id: 1,
        placa: 'BOL-1234'
      },
      estado: 'ACTIVO',
      fechaIngreso: new Date('2023-01-15'),
      observaciones: 'Conductor con experiencia en rutas largas'
    },
    {
      id: 2,
      nombre: 'Carlos',
      apellido: 'Mendoza',
      ci: '87654321',
      fechaNacimiento: new Date('1978-07-22'),
      telefono: '70987654',
      email: 'carlos.mendoza@email.com',
      direccion: 'Calle Falsa 456, Cochabamba',
      licencia: {
        numero: 'LIC-005678',
        categoria: 'D',
        fechaEmision: new Date('2019-05-10'),
        fechaVencimiento: new Date('2024-05-10'),
        estado: 'VIGENTE'
      },
      vehiculoAsignado: {
        id: 2,
        placa: 'BOL-5678'
      },
      estado: 'ACTIVO',
      fechaIngreso: new Date('2023-02-20'),
      observaciones: 'Especialista en transporte urbano'
    },
    {
      id: 3,
      nombre: 'Ana',
      apellido: 'Quispe',
      ci: '11223344',
      fechaNacimiento: new Date('1990-11-08'),
      telefono: '70445566',
      email: 'ana.quispe@email.com',
      direccion: 'Zona Sur 789, Santa Cruz',
      licencia: {
        numero: 'LIC-009012',
        categoria: 'E',
        fechaEmision: new Date('2021-03-20'),
        fechaVencimiento: new Date('2026-03-20'),
        estado: 'VIGENTE'
      },
      vehiculoAsignado: {
        id: 3,
        placa: 'BOL-9012'
      },
      estado: 'LICENCIA_MEDICA',
      fechaIngreso: new Date('2023-03-10'),
      observaciones: 'En proceso de renovación de licencia médica'
    },
    {
      id: 4,
      nombre: 'Roberto',
      apellido: 'Silva',
      ci: '55667788',
      fechaNacimiento: new Date('1982-12-03'),
      telefono: '70778899',
      email: 'roberto.silva@email.com',
      direccion: 'Villa Armonía 321, El Alto',
      licencia: {
        numero: 'LIC-003456',
        categoria: 'C',
        fechaEmision: new Date('2022-01-15'),
        fechaVencimiento: new Date('2027-01-15'),
        estado: 'VIGENTE'
      },
      vehiculoAsignado: {
        id: 5,
        placa: 'BOL-7890'
      },
      estado: 'ACTIVO',
      fechaIngreso: new Date('2023-05-12'),
      observaciones: 'Conductor más reciente, excelente record'
    },
    {
      id: 5,
      nombre: 'María',
      apellido: 'González',
      ci: '99887766',
      fechaNacimiento: new Date('1987-09-14'),
      telefono: '70111222',
      email: 'maria.gonzalez@email.com',
      direccion: 'Barrio Central 654, Oruro',
      licencia: {
        numero: 'LIC-007890',
        categoria: 'B',
        fechaEmision: new Date('2018-08-10'),
        fechaVencimiento: new Date('2023-08-10'),
        estado: 'VENCIDA'
      },
      vehiculoAsignado: null,
      estado: 'SUSPENDIDO',
      fechaIngreso: new Date('2023-04-05'),
      observaciones: 'Suspendido por licencia vencida'
    }
  ];

  getConductores(filters?: ConductorFilters): Observable<Conductor[]> {
    return of(this.conductores);
  }

  getConductorById(id: number): Observable<Conductor | undefined> {
    const conductor = this.conductores.find(c => c.id === id);
    return of(conductor);
  }

  getConductoresByEstado(estado: string): Observable<Conductor[]> {
    const conductoresFiltrados = this.conductores.filter(c => c.estado === estado);
    return of(conductoresFiltrados);
  }

  getConductoresActivos(): Observable<Conductor[]> {
    const conductoresActivos = this.conductores.filter(c => c.estado === 'ACTIVO');
    return of(conductoresActivos);
  }

  getConductoresDisponibles(): Observable<Conductor[]> {
    const conductoresDisponibles = this.conductores.filter(c => 
      c.estado === 'ACTIVO' && !c.vehiculoAsignado
    );
    return of(conductoresDisponibles);
  }

  createConductor(conductor: Omit<Conductor, 'id'>): Observable<Conductor> {
    const newId = Math.max(...this.conductores.map(c => c.id || 0)) + 1;
    const newConductor: Conductor = {
      ...conductor,
      id: newId,
      fechaIngreso: new Date()
    };
    this.conductores.push(newConductor);
    return of(newConductor);
  }

  updateConductor(id: number, conductor: Partial<Conductor>): Observable<Conductor | null> {
    const index = this.conductores.findIndex(c => c.id === id);
    if (index !== -1) {
      this.conductores[index] = { ...this.conductores[index], ...conductor };
      return of(this.conductores[index]);
    }
    return of(null);
  }

  deleteConductor(id: number): Observable<boolean> {
    const index = this.conductores.findIndex(c => c.id === id);
    if (index !== -1) {
      this.conductores.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  asignarVehiculo(conductorId: number, vehiculoId: number, vehiculoPlaca: string): Observable<boolean> {
    const conductor = this.conductores.find(c => c.id === conductorId);
    if (conductor) {
      conductor.vehiculoAsignado = { id: vehiculoId, placa: vehiculoPlaca };
      return of(true);
    }
    return of(false);
  }

  desasignarVehiculo(conductorId: number): Observable<boolean> {
    const conductor = this.conductores.find(c => c.id === conductorId);
    if (conductor) {
      conductor.vehiculoAsignado = null;
      return of(true);
    }
    return of(false);
  }

  getEstadisticas(): Observable<any> {
    const total = this.conductores.length;
    const activos = this.conductores.filter(c => c.estado === 'ACTIVO').length;
    const disponibles = this.conductores.filter(c => c.estado === 'ACTIVO' && !c.vehiculoAsignado).length;
    const suspendidos = this.conductores.filter(c => c.estado === 'SUSPENDIDO').length;
    const licenciaMedica = this.conductores.filter(c => c.estado === 'LICENCIA_MEDICA').length;
    
    const licenciasPorVencer = this.conductores.filter(c => {
      const fechaVencimiento = new Date(c.licencia.fechaVencimiento);
      const hoy = new Date();
      const diferencia = fechaVencimiento.getTime() - hoy.getTime();
      const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
      return diasRestantes <= 30 && diasRestantes >= 0;
    }).length;

    return of({
      total,
      activos,
      disponibles,
      suspendidos,
      licenciaMedica,
      licenciasPorVencer
    });
  }
}
