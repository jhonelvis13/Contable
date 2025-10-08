// src/app/modules/clientes/cliente-list/cliente-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteFormModalComponent } from '../cliente-form-modal/cliente-form-modal.component';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];

  tipoFilter: string = '';
  activoFilter: string = '';

  // Modal state
  showModal: boolean = false;
  selectedCliente: Cliente | null = null;

  tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'nit', label: 'NIT', sortable: true },
    { key: 'tipo', label: 'Tipo', sortable: true },
    { key: 'contacto', label: 'Contacto', sortable: false },
    { key: 'telefono', label: 'Teléfono', sortable: false },
    { key: 'totalFacturado', label: 'Total Facturado', sortable: true },
    { key: 'cantidadViajes', label: 'Viajes', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes.map(c => ({
          ...c,
          estado: c.activo ? 'Activo' : 'Inactivo'
        }));
        this.applyFilters();
      },
      error: (error) => console.error('Error loading clientes:', error)
    });
  }

  applyFilters(): void {
    this.filteredClientes = this.clientes.filter(cliente => {
      const tipoMatch = !this.tipoFilter || cliente.tipo === this.tipoFilter;
      const activoMatch = !this.activoFilter ||
        (this.activoFilter === 'Activo' && cliente.activo) ||
        (this.activoFilter === 'Inactivo' && !cliente.activo);

      return tipoMatch && activoMatch;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onTipoFilterChange(event: Event): void {
    this.tipoFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onActivoFilterChange(event: Event): void {
    this.activoFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  openNewClienteModal(): void {
    this.selectedCliente = null;
    this.showModal = true;
  }

  editCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    this.selectedCliente = cliente;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCliente = null;
  }

  onClienteGuardado(cliente: Cliente): void {
    this.loadClientes();
    this.closeModal();
  }

  deleteCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    if (confirm(`¿Está seguro de eliminar el cliente ${cliente.nombre}?`)) {
      this.clienteService.deleteCliente(cliente.id!).subscribe({
        next: () => {
          alert('Cliente eliminado exitosamente');
          this.loadClientes();
        },
        error: (error) => {
          console.error('Error deleting cliente:', error);
          alert('Error al eliminar el cliente');
        }
      });
    }
  }

  viewDetalle(cliente: Cliente): void {
    this.router.navigate(['/clientes', cliente.id]);
  }
}
