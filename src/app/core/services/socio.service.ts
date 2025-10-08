// src/app/core/services/socio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Socio, SocioFilters } from '../models/socio.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private apiUrl = `${environment.apiUrl}/socios`;

  constructor(private http: HttpClient) {}

  getSocios(filters?: SocioFilters): Observable<Socio[]> {
    // TODO: Replace with real API call
    // return this.http.get<Socio[]>(this.apiUrl, { params: filters as any });
    
    return of(this.getMockSocios());
  }

  getSocioById(id: number): Observable<Socio> {
    // return this.http.get<Socio>(`${this.apiUrl}/${id}`);
    const socio = this.getMockSocios().find(s => s.id === id);
    return of(socio!);
  }

  saveSocio(socio: Socio): Observable<Socio> {
    if (socio.id) {
      return this.http.put<Socio>(`${this.apiUrl}/${socio.id}`, socio);
    } else {
      return this.http.post<Socio>(this.apiUrl, socio);
    }
  }

  createSocio(socioData: Partial<Socio>): Observable<Socio> {
    // TODO: Replace with real API call
    // return this.http.post<Socio>(this.apiUrl, socioData);
    
    const newSocio: Socio = {
      id: Math.max(...this.getMockSocios().map(s => s.id || 0)) + 1,
      nombre: socioData.nombre || '',
      ciNit: socioData.ciNit || '',
      direccion: socioData.direccion || '',
      telefono: socioData.telefono || '',
      email: socioData.email,
      porcentajeParticipacion: socioData.porcentajeParticipacion || 0,
      activo: socioData.activo !== undefined ? socioData.activo : true,
      totalPagado: 0,
      totalPendiente: 0,
      cantidadViajes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return of(newSocio);
  }

  updateSocio(id: number, socioData: Partial<Socio>): Observable<Socio> {
    // TODO: Replace with real API call
    // return this.http.put<Socio>(`${this.apiUrl}/${id}`, socioData);
    
    const existingSocio = this.getMockSocios().find(s => s.id === id);
    if (!existingSocio) {
      throw new Error('Socio no encontrado');
    }
    
    const updatedSocio: Socio = {
      ...existingSocio,
      ...socioData,
      id: id,
      updatedAt: new Date()
    };
    
    return of(updatedSocio);
  }

  deleteSocio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private getMockSocios(): Socio[] {
    return [
      {
        id: 1,
        nombre: 'Roberto Mamani Condori',
        ciNit: '1234567 LP',
        direccion: 'Av. Buenos Aires #123, La Paz',
        telefono: '71234567',
        email: 'roberto.mamani@gmail.com',
        porcentajeParticipacion: 35,
        activo: true,
        totalPagado: 150000,
        totalPendiente: 25000,
        cantidadViajes: 12
      },
      {
        id: 2,
        nombre: 'Carmen Quispe Flores',
        ciNit: '2345678 CB',
        direccion: 'Av. Heroínas #456, Cochabamba',
        telefono: '72345678',
        email: 'carmen.quispe@hotmail.com',
        porcentajeParticipacion: 30,
        activo: true,
        totalPagado: 120000,
        totalPendiente: 30000,
        cantidadViajes: 10
      },
      {
        id: 3,
        nombre: 'José Luis Fernández',
        ciNit: '3456789 SC',
        direccion: 'Calle Junín #789, Santa Cruz',
        telefono: '73456789',
        email: 'jose.fernandez@gmail.com',
        porcentajeParticipacion: 25,
        activo: true,
        totalPagado: 100000,
        totalPendiente: 15000,
        cantidadViajes: 8
      },
      {
        id: 4,
        nombre: 'María Elena Vargas',
        ciNit: '4567890 OR',
        direccion: 'Av. 6 de Octubre #321, Oruro',
        telefono: '74567890',
        email: 'maria.vargas@outlook.com',
        porcentajeParticipacion: 10,
        activo: false,
        totalPagado: 45000,
        totalPendiente: 8000,
        cantidadViajes: 3
      }
    ];
  }
}