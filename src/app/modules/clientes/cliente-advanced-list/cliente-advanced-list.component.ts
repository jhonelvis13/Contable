import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdvancedTableColumn } from '../../../shared/components/advanced-data-table/advanced-data-table.component';

@Component({
  selector: 'app-cliente-advanced-list',
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Clientes - Tabla Avanzada</h1>
          <p class="text-gray-600 mt-1">Gestión avanzada con filtros, exportación y selección múltiple</p>
        </div>
        
        <div class="flex space-x-3">
          <button
            (click)="reloadData()"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center">
            <i class="fas fa-sync-alt mr-2"></i>
            Actualizar
          </button>
          <button
            (click)="openNewClienteModal()"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center">
            <i class="fas fa-plus mr-2"></i>
            Nuevo Cliente
          </button>
        </div>
      </div>

      <!-- Advanced Data Table -->
      <app-advanced-data-table
        [data]="clientes"
        [columns]="tableColumns"
        [loading]="(isLoadingClientes$ | async) || false"
        [selectable]="true"
        [searchable]="true"
        [showPagination]="true"
        [pageSize]="25"
        [bulkActions]="bulkActions"
        [exportOptions]="exportOptions"
        title="Lista de Clientes"
        loadingText="Cargando clientes..."
        emptyMessage="No hay clientes registrados. Crea el primer cliente para comenzar."
        (rowClick)="onRowClick($event)"
        (selectionChange)="onSelectionChange($event)"
        (bulkActionExecute)="onBulkAction($event)">
        
        <!-- Slot para acciones personalizadas -->
        <ng-template #actions let-row="row">
          <div class="flex items-center space-x-2">
            <button
              (click)="viewCliente(row, $event)"
              class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
              title="Ver detalles">
              <i class="fas fa-eye"></i>
            </button>
            <button
              (click)="editCliente(row, $event)"
              class="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition-colors"
              title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button
              (click)="deleteCliente(row, $event)"
              class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
              title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </ng-template>
      </app-advanced-data-table>

      <!-- Modal de Cliente -->
      <app-cliente-form-modal
        [data]="selectedCliente"
        [isVisible]="showModal"
        [editMode]="!!selectedCliente"
        (closeModal)="closeModal()"
        (saveData)="onClienteGuardado($event)">
      </app-cliente-form-modal>

      <!-- Toast Container -->
      <app-toast-container></app-toast-container>
    </div>
  `
})
export class ClienteAdvancedListComponent implements OnInit {
  clientes: Cliente[] = [];
  selectedCliente: Cliente | null = null;
  showModal: boolean = false;
  selectedRows: Cliente[] = [];

  // Loading states
  isLoadingClientes$: Observable<boolean>;

  // Configuración de columnas para la tabla avanzada
  tableColumns: AdvancedTableColumn[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '200px'
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
      width: '120px'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '180px'
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
      label: 'Cantidad Viajes',
      sortable: true,
      filterable: false,
      type: 'number',
      width: '120px'
    },
    {
      key: 'fechaRegistro',
      label: 'Fecha Registro',
      sortable: true,
      filterable: true,
      type: 'date',
      width: '130px'
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

  constructor(
    private clienteService: ClienteService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.isLoadingClientes$ = this.loadingService.isLoading('clientes-advanced-list');
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(showToast: boolean = false): void {
    this.loadingService.startDataLoading('clientes-advanced-list', 'Cargando clientes...');
    
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        // Agregar datos adicionales para la demo
        this.clientes = clientes.map(c => ({
          ...c,
          totalFacturado: Math.random() * 50000 + 5000,
          cantidadViajes: Math.floor(Math.random() * 20) + 1,
          fechaRegistro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        }));
        
        this.loadingService.stopLoading('clientes-advanced-list');
        
        if (showToast) {
          this.toastService.success(
            'Datos actualizados',
            `${clientes.length} clientes cargados correctamente`
          );
        }
      },
      error: (error) => {
        console.error('Error loading clientes:', error);
        this.loadingService.stopLoading('clientes-advanced-list');
        this.toastService.connectionError();
      }
    });
  }

  onRowClick(cliente: Cliente): void {
    console.log('Cliente clickeado:', cliente);
    // Aquí podrías navegar a la vista de detalle
  }

  onSelectionChange(selectedRows: Cliente[]): void {
    this.selectedRows = selectedRows;
    console.log('Selección cambiada:', selectedRows.length, 'clientes seleccionados');
  }

  onBulkAction(event: { action: any, selectedRows: Cliente[] }): void {
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
    this.toastService.success(
      'Clientes activados',
      `${clientes.length} clientes han sido activados correctamente`
    );
    this.loadClientes();
  }

  private deactivateClientes(clientes: Cliente[]): void {
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

  viewCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    console.log('Ver cliente:', cliente);
    // Implementar navegación a vista de detalle
  }

  editCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    this.selectedCliente = cliente;
    this.showModal = true;
  }

  deleteCliente(cliente: Cliente, event: Event): void {
    event.stopPropagation();
    
    if (confirm(`¿Está seguro de que desea eliminar al cliente "${cliente.nombre}"?`)) {
      this.loadingService.startOperationLoading('cliente-delete', 'Eliminando cliente...');
      
      this.clienteService.deleteCliente(cliente.id!).subscribe({
        next: () => {
          this.loadingService.stopLoading('cliente-delete');
          this.toastService.success(
            'Cliente eliminado',
            `El cliente "${cliente.nombre}" ha sido eliminado correctamente`
          );
          this.loadClientes();
        },
        error: (error) => {
          console.error('Error deleting cliente:', error);
          this.loadingService.stopLoading('cliente-delete');
          this.toastService.error(
            'Error al eliminar',
            'No se pudo eliminar el cliente'
          );
        }
      });
    }
  }

  openNewClienteModal(): void {
    this.selectedCliente = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCliente = null;
  }

  onClienteGuardado(cliente: Cliente): void {
    this.loadClientes(true);
    this.closeModal();
  }

  reloadData(): void {
    this.loadClientes(true);
  }
}