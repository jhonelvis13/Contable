// src/app/core/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cliente, ClienteFilters } from '../models/cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  getClientes(filters?: ClienteFilters): Observable<Cliente[]> {
    // TODO: Replace with real API call
    // return this.http.get<Cliente[]>(this.apiUrl, { params: filters as any });

    return of(this.getMockClientes());
  }

  getClienteById(id: number): Observable<Cliente> {
    // return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
    const cliente = this.getMockClientes().find(c => c.id === id);
    return of(cliente!);
  }

  saveCliente(cliente: Cliente): Observable<Cliente> {
    if (cliente.id) {
      return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
    } else {
      return this.http.post<Cliente>(this.apiUrl, cliente);
    }
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private getMockClientes(): Cliente[] {
    return [
      {
        id: 1,
        nombre: 'Transportes Bolivia S.A.',
        nit: '123456789',
        direccion: 'Av. 6 de Agosto #1234',
        telefono: '71234567',
        email: 'contacto@transportesbolivia.com',
        contacto: 'Juan Pérez',
        tipo: 'Empresa',
        activo: true,
        totalFacturado: 85000,
        cantidadViajes: 15
      },
      {
        id: 2,
        nombre: 'Minera del Sur',
        nit: '987654321',
        direccion: 'Zona Sur, Calle 10 #456',
        telefono: '72345678',
        email: 'minera@delsur.com',
        contacto: 'María González',
        tipo: 'Empresa',
        activo: true,
        totalFacturado: 120000,
        cantidadViajes: 22
      },
      {
        id: 3,
        nombre: 'Comercial La Paz',
        nit: '456789123',
        direccion: 'Av. Buenos Aires #789',
        telefono: '73456789',
        email: 'info@comerciallp.com',
        contacto: 'Carlos Rodríguez',
        tipo: 'Empresa',
        activo: true,
        totalFacturado: 65000,
        cantidadViajes: 12
      },
      {
        id: 4,
        nombre: 'Pedro Mamani',
        nit: '1234567-1L',
        direccion: 'Villa Fátima, Calle 3 #123',
        telefono: '74567890',
        email: 'pedro.mamani@gmail.com',
        contacto: 'Pedro Mamani',
        tipo: 'Particular',
        activo: true,
        totalFacturado: 15000,
        cantidadViajes: 3
      },
      {
        id: 5,
        nombre: 'Industrias del Norte',
        nit: '789123456',
        direccion: 'El Alto, Zona 16 de Julio',
        telefono: '75678901',
        email: 'contacto@industriasnorte.com',
        contacto: 'Ana López',
        tipo: 'Empresa',
        activo: false,
        totalFacturado: 45000,
        cantidadViajes: 8
      }
    ];
  }
}
