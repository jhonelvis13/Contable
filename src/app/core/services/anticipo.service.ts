// src/app/core/services/anticipo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Anticipo, AnticipoFilters } from '../models/anticipo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnticipoService {
  private apiUrl = `${environment.apiUrl}/anticipos`;

  constructor(private http: HttpClient) {}

  getAnticipos(filters?: AnticipoFilters): Observable<Anticipo[]> {
    // TODO: Replace with real API call
    // return this.http.get<Anticipo[]>(this.apiUrl, { params: filters as any });
    
    return of(this.getMockAnticipos());
  }

  getAnticipoById(id: number): Observable<Anticipo> {
    // return this.http.get<Anticipo>(`${this.apiUrl}/${id}`);
    const anticipo = this.getMockAnticipos().find(a => a.id === id);
    return of(anticipo!);
  }

  createAnticipo(anticipoData: Partial<Anticipo>): Observable<Anticipo> {
    // TODO: Replace with real API call
    // return this.http.post<Anticipo>(this.apiUrl, anticipoData);
    
    const newAnticipo: Anticipo = {
      id: Math.max(...this.getMockAnticipos().map(a => a.id || 0)) + 1,
      tipo: anticipoData.tipo || 'Empresa',
      beneficiario: anticipoData.beneficiario || 'Sin especificar',
      viajeId: anticipoData.viajeId,
      viajeDescripcion: anticipoData.viajeDescripcion,
      socioId: anticipoData.socioId,
      socioNombre: anticipoData.socioNombre,
      monto: anticipoData.monto || 0,
      montoTotal: anticipoData.monto || 0,
      fecha: anticipoData.fecha || new Date(),
      fechaSolicitud: anticipoData.fecha || new Date(),
      estado: anticipoData.estado || 'Pendiente',
      montoPagado: anticipoData.montoPagado || 0,
      montoPendiente: anticipoData.monto || 0,
      metodoPago: anticipoData.metodoPago || 'Efectivo',
      observaciones: anticipoData.observaciones,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return of(newAnticipo);
  }

  updateAnticipo(id: number, anticipoData: Partial<Anticipo>): Observable<Anticipo> {
    // TODO: Replace with real API call
    // return this.http.put<Anticipo>(`${this.apiUrl}/${id}`, anticipoData);
    
    const existingAnticipo = this.getMockAnticipos().find(a => a.id === id);
    if (!existingAnticipo) {
      throw new Error('Anticipo no encontrado');
    }
    
    const updatedAnticipo: Anticipo = {
      ...existingAnticipo,
      ...anticipoData,
      id: id,
      updatedAt: new Date()
    };
    
    return of(updatedAnticipo);
  }

  deleteAnticipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private getMockAnticipos(): Anticipo[] {
    return [
      {
        id: 1,
        tipo: 'Empresa',
        beneficiario: 'Transportes Unidos SRL',
        viajeId: 1,
        viajeDescripcion: 'Viaje La Paz - Santa Cruz',
        monto: 5000,
        montoTotal: 5000,
        fecha: new Date('2024-10-01'),
        fechaSolicitud: new Date('2024-10-01'),
        estado: 'Pendiente',
        montoPagado: 0,
        montoPendiente: 5000,
        metodoPago: 'Transferencia',
        observaciones: 'Anticipo para combustible'
      },
      {
        id: 2,
        tipo: 'Socio',
        beneficiario: 'Roberto Mamani Condori',
        socioId: 1,
        socioNombre: 'Roberto Mamani Condori',
        monto: 3000,
        montoTotal: 3000,
        fecha: new Date('2024-10-02'),
        fechaSolicitud: new Date('2024-10-02'),
        estado: 'Pagado',
        montoPagado: 3000,
        montoPendiente: 0,
        metodoPago: 'Efectivo',
        observaciones: 'Anticipo de ganancias'
      },
      {
        id: 3,
        tipo: 'Empresa',
        beneficiario: 'Flota Norte SRL',
        viajeId: 2,
        viajeDescripcion: 'Viaje Cochabamba - Oruro',
        monto: 2500,
        montoTotal: 2500,
        fecha: new Date('2024-10-03'),
        fechaSolicitud: new Date('2024-10-03'),
        estado: 'Parcial',
        montoPagado: 1000,
        montoPendiente: 1500,
        metodoPago: 'Cheque',
        observaciones: 'Pago parcial recibido'
      },
      {
        id: 4,
        tipo: 'Socio',
        beneficiario: 'Carmen Quispe Flores',
        socioId: 2,
        socioNombre: 'Carmen Quispe Flores',
        monto: 4000,
        montoTotal: 4000,
        fecha: new Date('2024-10-04'),
        fechaSolicitud: new Date('2024-10-04'),
        estado: 'Pendiente',
        montoPagado: 0,
        montoPendiente: 4000,
        metodoPago: 'Transferencia',
        observaciones: 'Anticipo solicitado por socio'
      },
      {
        id: 5,
        tipo: 'Empresa',
        beneficiario: 'Express Boliviano',
        viajeId: 3,
        viajeDescripcion: 'Viaje Santa Cruz - Tarija',
        monto: 6000,
        montoTotal: 6000,
        fecha: new Date('2024-10-05'),
        fechaSolicitud: new Date('2024-10-05'),
        estado: 'Pagado',
        montoPagado: 6000,
        montoPendiente: 0,
        metodoPago: 'Transferencia',
        observaciones: 'Anticipo completo pagado'
      }
    ];
  }
}