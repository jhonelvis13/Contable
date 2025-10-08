import { Component, OnInit } from '@angular/core';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { Vehiculo } from '../../../core/models/vehiculo.model';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService, LoadingState } from '../../../core/services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehiculo-list',
  templateUrl: './vehiculo-list.component.html',
  styleUrls: ['./vehiculo-list.component.scss']
})
export class VehiculoListComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];
  estadisticas: any = {};
  
  // Filtros
  filtroPlaca: string = '';
  filtroMarca: string = '';
  filtroTipo: string = '';
  filtroEstado: string = '';
  
  // Opciones para filtros
  marcas: string[] = [];
  tipos: string[] = ['MINIBUS', 'MICROBUS', 'AUTOBUS', 'CAMION', 'PICKUP', 'OTRO'];
  estados: string[] = ['ACTIVO', 'DISPONIBLE', 'MANTENIMIENTO', 'INACTIVO'];
  
  // Modal
  showModal: boolean = false;
  vehiculoSeleccionado: Vehiculo | null = null;

  // Estados de carga
  isLoadingVehiculos$: Observable<boolean>;
  isLoadingEstadisticas$: Observable<boolean>;
  loadingState$: Observable<LoadingState | null>;
  showOverlay: boolean = false;

  constructor(
    private vehiculoService: VehiculoService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {
    // Inicializar observables de carga
    this.isLoadingVehiculos$ = this.loadingService.isLoading('vehiculos-list');
    this.isLoadingEstadisticas$ = this.loadingService.isLoading('vehiculos-stats');
    this.loadingState$ = this.loadingService.getLoadingState('vehiculos-operation');
  }

  ngOnInit(): void {
    this.loadVehiculos();
    this.loadEstadisticas();
  }

  loadVehiculos(showToast: boolean = false): void {
    this.loadingService.startDataLoading('vehiculos-list', 'Cargando vehículos...');
    
    this.vehiculoService.getVehiculos().subscribe({
      next: (vehiculos) => {
        this.vehiculos = vehiculos;
        this.vehiculosFiltrados = vehiculos;
        this.extraerMarcas();
        this.loadingService.stopLoading('vehiculos-list');
        
        // Solo mostrar mensaje si es recarga manual
        if (showToast && this.vehiculos.length > 0) {
          this.toastService.info(
            'Datos actualizados', 
            `Se cargaron ${this.vehiculos.length} vehículos correctamente.`
          );
        }
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
        this.loadingService.stopLoading('vehiculos-list');
        this.toastService.connectionError();
      }
    });
  }

  loadEstadisticas(): void {
    this.loadingService.startDataLoading('vehiculos-stats', 'Cargando estadísticas...');
    
    this.vehiculoService.getEstadisticas().subscribe({
      next: (stats) => {
        this.estadisticas = stats;
        this.loadingService.stopLoading('vehiculos-stats');
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.loadingService.stopLoading('vehiculos-stats');
      }
    });
  }

  extraerMarcas(): void {
    this.marcas = [...new Set(this.vehiculos.map(v => v.marca))];
  }

  aplicarFiltros(): void {
    this.vehiculosFiltrados = this.vehiculos.filter(vehiculo => {
      return (
        (!this.filtroPlaca || vehiculo.placa.toLowerCase().includes(this.filtroPlaca.toLowerCase())) &&
        (!this.filtroMarca || vehiculo.marca === this.filtroMarca) &&
        (!this.filtroTipo || vehiculo.tipo === this.filtroTipo) &&
        (!this.filtroEstado || vehiculo.estado === this.filtroEstado)
      );
    });
  }

  limpiarFiltros(): void {
    this.filtroPlaca = '';
    this.filtroMarca = '';
    this.filtroTipo = '';
    this.filtroEstado = '';
    this.vehiculosFiltrados = this.vehiculos;
  }

  abrirModal(vehiculo?: Vehiculo): void {
    this.vehiculoSeleccionado = vehiculo || null;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.vehiculoSeleccionado = null;
  }

  onVehiculoGuardado(vehiculo: any): void {
    this.cerrarModal();
    this.loadVehiculos();
    this.loadEstadisticas();
  }

  eliminarVehiculo(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este vehículo?')) {
      this.vehiculoService.deleteVehiculo(id).subscribe(success => {
        if (success) {
          this.loadVehiculos();
          this.loadEstadisticas();
        }
      });
    }
  }

  asignarConductor(vehiculo: Vehiculo): void {
    // Lógica para asignar conductor (implementar cuando se tenga el módulo de conductores)
    console.log('Asignar conductor a vehículo:', vehiculo.placa);
  }

  desasignarConductor(vehiculo: Vehiculo): void {
    if (confirm(`¿Desea desasignar el conductor ${vehiculo.conductorNombre} del vehículo ${vehiculo.placa}?`)) {
      this.vehiculoService.desasignarConductor(vehiculo.id!).subscribe(success => {
        if (success) {
          this.loadVehiculos();
          this.loadEstadisticas();
        }
      });
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800';
      case 'DISPONIBLE':
        return 'bg-blue-100 text-blue-800';
      case 'MANTENIMIENTO':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEstadoVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' {
    switch (estado) {
      case 'ACTIVO':
        return 'success';
      case 'DISPONIBLE':
        return 'info';
      case 'MANTENIMIENTO':
        return 'warning';
      case 'INACTIVO':
        return 'error';
      default:
        return 'secondary';
    }
  }

  getTipoColor(tipo: string): string {
    switch (tipo) {
      case 'MINIBUS':
        return 'bg-purple-100 text-purple-800';
      case 'MICROBUS':
        return 'bg-indigo-100 text-indigo-800';
      case 'AUTOBUS':
        return 'bg-blue-100 text-blue-800';
      case 'CAMION':
        return 'bg-orange-100 text-orange-800';
      case 'PICKUP':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoVariant(tipo: string): 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' {
    switch (tipo) {
      case 'MINIBUS':
      case 'MICROBUS':
        return 'primary';
      case 'AUTOBUS':
        return 'info';
      case 'CAMION':
        return 'warning';
      case 'PICKUP':
        return 'success';
      default:
        return 'secondary';
    }
  }

  estaVencido(fecha: Date): boolean {
    const hoy = new Date();
    return new Date(fecha) < hoy;
  }

  // Métodos de demostración para Toast Service
  demoToastSuccess(): void {
    this.toastService.savedSuccessfully('vehículo');
  }

  demoToastError(): void {
    this.toastService.error(
      'Error al procesar',
      'No se pudo completar la operación. Verifique los datos ingresados.',
      {
        actions: [
          {
            label: 'Reintentar',
            handler: () => this.loadVehiculos(),
            style: 'primary'
          },
          {
            label: 'Cancelar',
            handler: () => console.log('Operación cancelada'),
            style: 'secondary'
          }
        ]
      }
    );
  }

  demoToastWarning(): void {
    this.toastService.warning(
      'Documentos por vencer',
      'Hay 3 vehículos con documentos que vencen en los próximos 30 días.',
      {
        actions: [
          {
            label: 'Ver detalles',
            handler: () => console.log('Ver vehículos con documentos por vencer'),
            style: 'primary'
          }
        ]
      }
    );
  }

  demoToastInfo(): void {
    this.toastService.info(
      'Información del sistema',
      'La sincronización automática se ejecutará en 5 minutos.',
      {
        duration: 10000 // 10 segundos
      }
    );
  }

  demoToastPersistent(): void {
    const toastId = this.toastService.error(
      'Acción requerida',
      'Esta notificación requiere su atención y no desaparecerá automáticamente.',
      {
        duration: 0, // No auto dismiss
        actions: [
          {
            label: 'Entendido',
            handler: () => this.toastService.dismiss(toastId),
            style: 'primary'
          }
        ]
      }
    );
  }

  // ===== MÉTODOS DE DEMOSTRACIÓN PARA ESTADOS DE CARGA =====

  demoSkeletonTable(): void {
    this.loadVehiculos(true);
  }

  demoSkeletonStats(): void {
    this.loadEstadisticas();
  }

  demoSpinnerOperation(): void {
    this.loadingService.startOperationLoading('vehiculos-operation', 'Procesando solicitud...');
    
    // Simular operación
    setTimeout(() => {
      this.loadingService.stopLoading('vehiculos-operation');
      this.toastService.success('Operación completada', 'La solicitud se procesó correctamente.');
    }, 2000);
  }

  demoProgressUpload(): void {
    this.loadingService.simulateProgress('vehiculos-upload', 4000, () => {
      this.toastService.success('Carga completada', 'Los archivos se subieron correctamente.');
    });
  }

  demoOverlayLoading(): void {
    this.showOverlay = true;
    this.loadingService.startOverlayLoading('Guardando cambios importantes...');
    
    // Simular operación larga
    setTimeout(() => {
      this.loadingService.stopLoading('overlay');
      this.showOverlay = false;
      this.toastService.success('Cambios guardados', 'Todos los cambios se guardaron correctamente.');
    }, 3000);
  }

  demoLoadingWithError(): void {
    this.loadingService.startDataLoading('vehiculos-error', 'Intentando conectar...');
    
    // Simular error después de 2 segundos
    setTimeout(() => {
      this.loadingService.stopLoading('vehiculos-error');
      this.toastService.error(
        'Error de conexión',
        'No se pudo conectar con el servidor. Verifique su conexión a internet.',
        {
          actions: [
            {
              label: 'Reintentar',
              handler: () => this.demoLoadingWithError(),
              style: 'primary'
            }
          ]
        }
      );
    }, 2000);
  }

  // Recargar datos manualmente
  reloadData(): void {
    this.loadVehiculos(true);
    this.loadEstadisticas();
  }

  estaProximoAVencer(fecha: Date): boolean {
    const hoy = new Date();
    const fechaVencimiento = new Date(fecha);
    const diferencia = fechaVencimiento.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
    return diasRestantes <= 30 && diasRestantes >= 0;
  }

  trackByVehiculo(index: number, vehiculo: Vehiculo): number {
    return vehiculo.id || index;
  }
}