// src/app/modules/clientes/cliente-list/cliente-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteFormModalComponent } from '../cliente-form-modal/cliente-form-modal.component';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

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

  // Loading states
  isLoadingClientes$: Observable<boolean>;
  isLoadingStats$: Observable<boolean>;

  // Estadísticas
  estadisticas = {
    total: 0,
    activos: 0,
    inactivos: 0,
    empresas: 0,
    particulares: 0
  };

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

  // Configuración para AdvancedDataTable
  advancedTableColumns: any[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '180px'
    },
    {
      key: 'nit',
      label: 'NIT',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '120px'
    },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
      filterable: true,
      type: 'badge',
      badgeColors: {
        'Empresa': '#3B82F6',
        'Particular': '#6B7280'
      },
      width: '100px'
    },
    {
      key: 'contacto',
      label: 'Contacto',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '150px'
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      sortable: false,
      filterable: true,
      type: 'text',
      width: '130px'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '200px'
    },
    {
      key: 'totalFacturado',
      label: 'Total Facturado',
      sortable: true,
      filterable: false,
      type: 'currency',
      width: '140px'
    },
    {
      key: 'cantidadViajes',
      label: 'Viajes',
      sortable: true,
      filterable: false,
      type: 'number',
      width: '80px'
    },
    {
      key: 'activo',
      label: 'Estado',
      sortable: true,
      filterable: true,
      type: 'badge',
      badgeColors: {
        'true': '#10B981',
        'false': '#EF4444'
      },
      format: (value: boolean) => value ? 'Activo' : 'Inactivo',
      width: '100px'
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      filterable: false,
      type: 'actions',
      exportable: false,
      width: '120px'
    }
  ];

  // Acciones masivas
  bulkActions = [
    {
      id: 'activate',
      label: 'Activar seleccionados',
      icon: 'fas fa-check-circle',
      class: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      id: 'deactivate',
      label: 'Desactivar seleccionados',
      icon: 'fas fa-times-circle',
      class: 'bg-red-100 text-red-700 hover:bg-red-200'
    },
    {
      id: 'export',
      label: 'Exportar seleccionados',
      icon: 'fas fa-download',
      class: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    }
  ];

  // Opciones de exportación
  exportOptions = {
    filename: 'clientes.xlsx',
    title: 'Lista de Clientes',
    includeDate: true
  };

  selectedRows: Cliente[] = [];
  useAdvancedTable: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private router: Router,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    // Inicializar observables de carga
    this.isLoadingClientes$ = this.loadingService.isLoading('clientes-list');
    this.isLoadingStats$ = this.loadingService.isLoading('clientes-stats');
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadEstadisticas();
  }

  loadClientes(showToast: boolean = false): void {
    this.loadingService.startDataLoading('clientes-list', 'Cargando clientes...');
    
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes.map(c => ({
          ...c,
          estado: c.activo ? 'Activo' : 'Inactivo'
        }));
        this.applyFilters();
        this.loadingService.stopLoading('clientes-list');
        
        if (showToast) {
          this.toastService.success(
            'Datos actualizados',
            `${clientes.length} clientes cargados correctamente`
          );
        }
      },
      error: (error) => {
        console.error('Error loading clientes:', error);
        this.loadingService.stopLoading('clientes-list');
        this.toastService.connectionError();
      }
    });
  }

  loadEstadisticas(): void {
    this.loadingService.startDataLoading('clientes-stats', 'Cargando estadísticas...');
    
    // Calcular estadísticas localmente por ahora
    setTimeout(() => {
      this.estadisticas = {
        total: this.clientes.length,
        activos: this.clientes.filter(c => c.activo).length,
        inactivos: this.clientes.filter(c => !c.activo).length,
        empresas: this.clientes.filter(c => c.tipo === 'Empresa').length,
        particulares: this.clientes.filter(c => c.tipo === 'Particular').length
      };
      this.loadingService.stopLoading('clientes-stats');
    }, 500);
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
    this.loadClientes(true);
    this.loadEstadisticas();
    this.closeModal();
  }

  deleteCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    
    if (confirm(`¿Está seguro de que desea eliminar al cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`)) {
      this.loadingService.startOperationLoading('cliente-delete', 'Eliminando cliente...');
      
      this.clienteService.deleteCliente(cliente.id!).subscribe({
        next: () => {
          this.loadingService.stopLoading('cliente-delete');
          this.toastService.success(
            'Cliente eliminado',
            `El cliente "${cliente.nombre}" ha sido eliminado correctamente`
          );
          this.loadClientes();
          this.loadEstadisticas();
        },
        error: (error) => {
          console.error('Error deleting cliente:', error);
          this.loadingService.stopLoading('cliente-delete');
          this.toastService.error(
            'Error al eliminar',
            'No se pudo eliminar el cliente. Verifique que no tenga viajes asociados.',
            {
              actions: [
                {
                  label: 'Reintentar',
                  handler: () => this.deleteCliente(cliente, event),
                  style: 'primary'
                }
              ]
            }
          );
        }
      });
    }
  }

  // Método de recarga manual
  reloadData(): void {
    this.loadClientes(true);
    this.loadEstadisticas();
  }

  viewDetalle(cliente: Cliente): void {
    this.router.navigate(['/clientes', cliente.id]);
  }

  // Métodos para AdvancedDataTable
  onAdvancedRowClick(cliente: Cliente): void {
    this.viewDetalle(cliente);
  }

  onAdvancedSelectionChange(selectedRows: Cliente[]): void {
    this.selectedRows = selectedRows;
    console.log('Selección cambiada:', selectedRows.length, 'clientes seleccionados');
  }

  onAdvancedBulkAction(event: { action: any, selectedRows: Cliente[] }): void {
    const { action, selectedRows } = event;
    
    switch (action.id) {
      case 'activate':
        this.activateClientes(selectedRows);
        break;
      case 'deactivate':
        this.deactivateClientes(selectedRows);
        break;
      case 'export':
        this.exportSelectedClientes(selectedRows);
        break;
    }
  }

  private activateClientes(clientes: Cliente[]): void {
    // Implementar lógica de activación masiva
    this.toastService.success(
      'Clientes activados',
      `${clientes.length} clientes han sido activados correctamente`
    );
    this.loadClientes();
  }

  private deactivateClientes(clientes: Cliente[]): void {
    // Implementar lógica de desactivación masiva
    this.toastService.success(
      'Clientes desactivados',
      `${clientes.length} clientes han sido desactivados correctamente`
    );
    this.loadClientes();
  }

  private exportSelectedClientes(clientes: Cliente[]): void {
    this.toastService.info(
      'Exportando clientes',
      `Preparando exportación de ${clientes.length} clientes seleccionados`
    );
  }

  advancedViewCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    this.viewDetalle(cliente);
  }

  advancedEditCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    this.editCliente(cliente, event);
  }

  advancedDeleteCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    this.deleteCliente(cliente, event);
  }
}
