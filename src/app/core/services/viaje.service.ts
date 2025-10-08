// src/app/core/services/viaje.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Viaje, ViajeFilters } from '../models/viaje.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private apiUrl = `${environment.apiUrl}/viajes`;

  constructor(private http: HttpClient) {}

  getViajes(filters?: ViajeFilters): Observable<Viaje[]> {
    // TODO: Replace with real API call
    // return this.http.get<Viaje[]>(this.apiUrl, { params: filters as any });
    
    return of(this.getMockViajes());
  }

  getViajeById(id: number): Observable<Viaje> {
    // return this.http.get<Viaje>(`${this.apiUrl}/${id}`);
    const viaje = this.getMockViajes().find(v => v.id === id);
    return of(viaje!);
  }

  saveViaje(viaje: Viaje): Observable<Viaje> {
    if (viaje.id) {
      return this.http.put<Viaje>(`${this.apiUrl}/${viaje.id}`, viaje);
    } else {
      return this.http.post<Viaje>(this.apiUrl, viaje);
    }
  }

  deleteViaje(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUltimosViajes(): Observable<Viaje[]> {
    const viajes = this.getMockViajes().slice(0, 5);
    return of(viajes);
  }

  private getMockViajes(): Viaje[] {
    return [
      {
        id: 1,
        tipo: 'Nacional',
        clienteId: 1,
        clienteNombre: 'Transportes Bolivia S.A.',
        producto: 'Cemento Portland',
        montoTotal: 25000,
        anticipo: 15000,
        montoPendiente: 10000,
        conductorId: 1,
        conductorNombre: 'Juan Carlos Pérez',
        vehiculoId: 1,
        vehiculoPlaca: 'ABC-1234',
        estado: 'En curso',
        fechaInicio: new Date('2025-10-01'),
        origen: 'La Paz',
        destino: 'Santa Cruz',
        observaciones: 'Carga frágil, manejar con cuidado'
      },
      {
        id: 2,
        tipo: 'Internacional',
        clienteId: 2,
        clienteNombre: 'Minera del Sur',
        producto: 'Mineral de zinc',
        montoTotal: 45000,
        anticipo: 30000,
        montoPendiente: 15000,
        conductorId: 2,
        conductorNombre: 'María González',
        vehiculoId: 2,
        vehiculoPlaca: 'DEF-5678',
        estado: 'Finalizado',
        fechaInicio: new Date('2025-09-25'),
        fechaFin: new Date('2025-09-30'),
        origen: 'Oruro',
        destino: 'Arica - Chile'
      },
      {
        id: 3,
        tipo: 'Nacional',
        clienteId: 3,
        clienteNombre: 'Comercial La Paz',
        producto: 'Productos alimenticios',
        montoTotal: 18000,
        anticipo: 8000,
        montoPendiente: 10000,
        conductorId: 3,
        conductorNombre: 'Carlos Rodríguez',
        vehiculoId: 3,
        vehiculoPlaca: 'GHI-9012',
        estado: 'Pendiente',
        fechaInicio: new Date('2025-10-05'),
        origen: 'Cochabamba',
        destino: 'Sucre'
      },
      {
        id: 4,
        tipo: 'Nacional',
        clienteId: 4,
        clienteNombre: 'Pedro Mamani',
        producto: 'Maquinaria industrial',
        montoTotal: 35000,
        anticipo: 20000,
        montoPendiente: 15000,
        conductorId: 1,
        conductorNombre: 'Juan Carlos Pérez',
        vehiculoId: 4,
        vehiculoPlaca: 'JKL-3456',
        estado: 'En curso',
        fechaInicio: new Date('2025-10-03'),
        origen: 'Santa Cruz',
        destino: 'Tarija'
      },
      {
        id: 5,
        tipo: 'Internacional',
        clienteId: 5,
        clienteNombre: 'Industrias del Norte',
        producto: 'Textiles',
        montoTotal: 28000,
        anticipo: 28000,
        montoPendiente: 0,
        conductorId: 4,
        conductorNombre: 'Ana López',
        vehiculoId: 5,
        vehiculoPlaca: 'MNO-7890',
        estado: 'Finalizado',
        fechaInicio: new Date('2025-09-20'),
        fechaFin: new Date('2025-09-28'),
        origen: 'El Alto',
        destino: 'Lima - Perú'
      }
    ];
  }
}