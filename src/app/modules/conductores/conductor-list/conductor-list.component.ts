import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConductorService } from '../../../core/services/conductor.service';
import { Conductor } from '../../../core/models/conductor.model';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-conductor-list',
  templateUrl: './conductor-list.component.html',
  styleUrls: ['./conductor-list.component.scss']
})
export class ConductorListComponent implements OnInit {
  conductores: Conductor[] = [];
  conductoresFiltrados: Conductor[] = [];
  estadisticas: any = {};
  
  // Filtros
  filtroNombre: string = '';
  filtroApellido: string = '';
  filtroCI: string = '';
  filtroEstado: string = '';
  filtroCategoria: string = '';
  filtroVehiculo: string = '';
  
  // Opciones para filtros
  estados: string[] = ['ACTIVO', 'SUSPENDIDO', 'LICENCIA_MEDICA', 'INACTIVO'];
  categorias: string[] = ['A', 'B', 'C', 'D', 'E'];
  
  // Modal
  showModal: boolean = false;
  conductorSeleccionado: Conductor | null = null;

  // Loading states
  isLoadingConductores$: Observable<boolean>;
  isLoadingStats$: Observable<boolean>;

  // Advanced table
  useAdvancedTable: boolean = false;
  selectedRows: Conductor[] = [];

  // Configuración para AdvancedDataTable
  advancedTableColumns: any[] = [
    {
      key: 'nombres',
      label: 'Nombres',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '150px'
    },
    {
      key: 'apellidos',
      label: 'Apellidos',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '150px'
    },
    {
      key: 'ci',
      label: 'CI',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '120px'
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
      key: 'categoria',
      label: 'Categoría',
      sortable: true,
      filterable: true,
      type: 'badge',
      badgeColors: {
        'A': '#10B981',
        'B': '#3B82F6',
        'C': '#F59E0B',
        'D': '#EF4444',
        'E': '#8B5CF6'
      },
      width: '100px'
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      filterable: true,
      type: 'badge',
      badgeColors: {
        'ACTIVO': '#10B981',
        'SUSPENDIDO': '#EF4444',
        'LICENCIA_MEDICA': '#F59E0B',
        'INACTIVO': '#6B7280'
      },
      width: '120px'
    },
    {
      key: 'vehiculoAsignado',
      label: 'Vehículo',
      sortable: true,
      filterable: true,
      type: 'text',
      width: '140px'
    },
    {
      key: 'fechaIngreso',
      label: 'Fecha Ingreso',
      sortable: true,
      filterable: true,
      type: 'date',
      width: '130px'
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

  // Acciones masivas para conductores
  bulkActions = [
    {
      id: 'activate',
      label: 'Activar seleccionados',
      icon: 'fas fa-check-circle',
      class: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      id: 'suspend',
      label: 'Suspender seleccionados',
      icon: 'fas fa-ban',
      class: 'bg-red-100 text-red-700 hover:bg-red-200'
    },
    {
      id: 'medical_leave',
      label: 'Licencia médica',
      icon: 'fas fa-user-md',
      class: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
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
    filename: 'conductores.xlsx',
    title: 'Lista de Conductores',
    includeDate: true
  };

  constructor(
    private conductorService: ConductorService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    // Inicializar observables de carga
    this.isLoadingConductores$ = this.loadingService.isLoading('conductores-list');
    this.isLoadingStats$ = this.loadingService.isLoading('conductores-stats');
  }

  ngOnInit(): void {
    this.loadConductores();
    this.loadEstadisticas();
  }

  loadConductores(showToast: boolean = false): void {
    this.loadingService.startDataLoading('conductores-list', 'Cargando conductores...');
    
    this.conductorService.getConductores().subscribe({
      next: (conductores) => {
        this.conductores = conductores;
        this.conductoresFiltrados = conductores;
        this.loadingService.stopLoading('conductores-list');
        
        if (showToast) {
          this.toastService.success(
            'Datos actualizados',
            `${conductores.length} conductores cargados correctamente`
          );
        }
      },
      error: (error) => {
        console.error('Error loading conductores:', error);
        this.loadingService.stopLoading('conductores-list');
        this.toastService.connectionError();
      }
    });
  }

  loadEstadisticas(): void {
    this.loadingService.startDataLoading('conductores-stats', 'Cargando estadísticas...');
    
    // Calcular estadísticas localmente por ahora
    setTimeout(() => {
      this.estadisticas = {
        total: this.conductores.length,
        activos: this.conductores.filter(c => c.estado === 'ACTIVO').length,
        suspendidos: this.conductores.filter(c => c.estado === 'SUSPENDIDO').length,
        conVehiculo: this.conductores.filter(c => c.vehiculoAsignado).length,
        sinVehiculo: this.conductores.filter(c => !c.vehiculoAsignado).length,
        licenciasVencidas: this.conductores.filter(c => c.licencia.fechaVencimiento && new Date(c.licencia.fechaVencimiento) < new Date()).length
      };
      this.loadingService.stopLoading('conductores-stats');
    }, 500);
  }

  aplicarFiltros(): void {
    this.conductoresFiltrados = this.conductores.filter(conductor => {
      const nombreCompleto = `${conductor.nombre} ${conductor.apellido}`.toLowerCase();
      const filtroTexto = `${this.filtroNombre} ${this.filtroApellido}`.toLowerCase().trim();
      
      return (
        (!filtroTexto || nombreCompleto.includes(filtroTexto)) &&
        (!this.filtroCI || conductor.ci.includes(this.filtroCI)) &&
        (!this.filtroEstado || conductor.estado === this.filtroEstado) &&
        (!this.filtroCategoria || conductor.licencia.categoria === this.filtroCategoria) &&
        (!this.filtroVehiculo || (
          this.filtroVehiculo === 'CON_VEHICULO' ? !!conductor.vehiculoAsignado :
          this.filtroVehiculo === 'SIN_VEHICULO' ? !conductor.vehiculoAsignado : true
        ))
      );
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroApellido = '';
    this.filtroCI = '';
    this.filtroEstado = '';
    this.filtroCategoria = '';
    this.filtroVehiculo = '';
    this.conductoresFiltrados = this.conductores;
  }

  abrirModal(conductor?: Conductor): void {
    this.conductorSeleccionado = conductor || null;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.conductorSeleccionado = null;
  }

  onConductorGuardado(conductor: any): void {
    this.cerrarModal();
    this.loadConductores(true);
    this.loadEstadisticas();
  }

  eliminarConductor(id: number): void {
    const conductor = this.conductores.find(c => c.id === id);
    if (!conductor) return;

    if (confirm(`¿Está seguro de que desea eliminar al conductor "${conductor.nombre} ${conductor.apellido}"? Esta acción no se puede deshacer.`)) {
      this.loadingService.startOperationLoading('conductor-delete', 'Eliminando conductor...');
      
      this.conductorService.deleteConductor(id).subscribe({
        next: (success) => {
          this.loadingService.stopLoading('conductor-delete');
          if (success) {
            this.toastService.success(
              'Conductor eliminado',
              `El conductor "${conductor.nombre} ${conductor.apellido}" ha sido eliminado correctamente`
            );
            this.loadConductores();
            this.loadEstadisticas();
          } else {
            this.toastService.error(
              'Error al eliminar',
              'No se pudo eliminar el conductor'
            );
          }
        },
        error: (error) => {
          console.error('Error deleting conductor:', error);
          this.loadingService.stopLoading('conductor-delete');
          this.toastService.error(
            'Error al eliminar',
            'No se pudo eliminar el conductor. Verifique que no tenga viajes asociados.',
            {
              actions: [
                {
                  label: 'Reintentar',
                  handler: () => this.eliminarConductor(id),
                  style: 'primary'
                }
              ]
            }
          );
        }
      });
    }
  }

  asignarVehiculo(conductor: Conductor): void {
    // Lógica para asignar vehículo (implementar cuando se tenga el módulo de vehículos)
    console.log('Asignar vehículo a conductor:', conductor.nombre);
  }

  desasignarVehiculo(conductor: Conductor): void {
    if (confirm(`¿Desea desasignar el vehículo ${conductor.vehiculoAsignado?.placa} del conductor ${conductor.nombre} ${conductor.apellido}?`)) {
      this.loadingService.startOperationLoading('conductor-unassign', 'Desasignando vehículo...');
      
      this.conductorService.desasignarVehiculo(conductor.id!).subscribe({
        next: (success) => {
          this.loadingService.stopLoading('conductor-unassign');
          if (success) {
            this.toastService.success(
              'Vehículo desasignado',
              `El vehículo ha sido desasignado del conductor ${conductor.nombre} ${conductor.apellido}`
            );
            this.loadConductores();
            this.loadEstadisticas();
          }
        },
        error: (error) => {
          console.error('Error unassigning vehicle:', error);
          this.loadingService.stopLoading('conductor-unassign');
          this.toastService.error(
            'Error al desasignar',
            'No se pudo desasignar el vehículo'
          );
        }
      });
    }
  }

  // Método de recarga manual
  reloadData(): void {
    this.loadConductores(true);
    this.loadEstadisticas();
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDIDO':
        return 'bg-red-100 text-red-800';
      case 'LICENCIA_MEDICA':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoriaColor(categoria: string): string {
    switch (categoria) {
      case 'A':
        return 'bg-blue-100 text-blue-800';
      case 'B':
        return 'bg-green-100 text-green-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-purple-100 text-purple-800';
      case 'E':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getLicenciaEstadoColor(estado: string): string {
    switch (estado) {
      case 'VIGENTE':
        return 'text-green-600';
      case 'VENCIDA':
        return 'text-red-600';
      case 'SUSPENDIDA':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  }

  estaVencida(fecha: Date): boolean {
    const hoy = new Date();
    return new Date(fecha) < hoy;
  }

  estaProximaAVencer(fecha: Date): boolean {
    const hoy = new Date();
    const fechaVencimiento = new Date(fecha);
    const diferencia = fechaVencimiento.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
    return diasRestantes <= 30 && diasRestantes >= 0;
  }

  getEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const edad = hoy.getFullYear() - new Date(fechaNacimiento).getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = new Date(fechaNacimiento).getMonth();
    
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < new Date(fechaNacimiento).getDate())) {
      return edad - 1;
    }
    return edad;
  }

  trackByConductor(index: number, conductor: Conductor): number {
    return conductor.id || index;
  }

  // Métodos para AdvancedDataTable
  onAdvancedRowClick(conductor: Conductor): void {
    console.log('Conductor clickeado:', conductor);
    // Aquí podrías navegar a la vista de detalle
  }

  onAdvancedSelectionChange(selectedRows: Conductor[]): void {
    this.selectedRows = selectedRows;
    console.log('Selección cambiada:', selectedRows.length, 'conductores seleccionados');
  }

  onAdvancedBulkAction(event: { action: any, selectedRows: Conductor[] }): void {
    const { action, selectedRows } = event;
    
    switch (action.id) {
      case 'activate':
        this.activateConductores(selectedRows);
        break;
      case 'suspend':
        this.suspendConductores(selectedRows);
        break;
      case 'medical_leave':
        this.medicalLeaveConductores(selectedRows);
        break;
      case 'export':
        this.exportSelectedConductores(selectedRows);
        break;
    }
  }

  private activateConductores(conductores: Conductor[]): void {
    this.toastService.success(
      'Conductores activados',
      `${conductores.length} conductores han sido activados correctamente`
    );
    this.loadConductores();
    this.loadEstadisticas();
  }

  private suspendConductores(conductores: Conductor[]): void {
    this.toastService.warning(
      'Conductores suspendidos',
      `${conductores.length} conductores han sido suspendidos`
    );
    this.loadConductores();
    this.loadEstadisticas();
  }

  private medicalLeaveConductores(conductores: Conductor[]): void {
    this.toastService.info(
      'Licencia médica aplicada',
      `${conductores.length} conductores en licencia médica`
    );
    this.loadConductores();
    this.loadEstadisticas();
  }

  private exportSelectedConductores(conductores: Conductor[]): void {
    this.toastService.info(
      'Exportando conductores',
      `Preparando exportación de ${conductores.length} conductores seleccionados`
    );
  }

  advancedViewConductor(conductor: Conductor, event: Event): void {
    event.stopPropagation();
    console.log('Ver conductor:', conductor);
  }

  advancedEditConductor(conductor: Conductor, event: Event): void {
    event.stopPropagation();
    this.abrirModal(conductor);
  }

  advancedDeleteConductor(conductor: Conductor, event: Event): void {
    event.stopPropagation();
    if (conductor.id) {
      this.eliminarConductor(conductor.id);
    }
  }
}