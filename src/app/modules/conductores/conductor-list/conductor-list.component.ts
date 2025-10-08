import { Component, OnInit } from '@angular/core';
import { ConductorService } from '../../../core/services/conductor.service';
import { Conductor } from '../../../core/models/conductor.model';

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

  constructor(private conductorService: ConductorService) {}

  ngOnInit(): void {
    this.loadConductores();
    this.loadEstadisticas();
  }

  loadConductores(): void {
    this.conductorService.getConductores().subscribe(conductores => {
      this.conductores = conductores;
      this.conductoresFiltrados = conductores;
    });
  }

  loadEstadisticas(): void {
    this.conductorService.getEstadisticas().subscribe(stats => {
      this.estadisticas = stats;
    });
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
    this.loadConductores();
    this.loadEstadisticas();
  }

  eliminarConductor(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este conductor?')) {
      this.conductorService.deleteConductor(id).subscribe(success => {
        if (success) {
          this.loadConductores();
          this.loadEstadisticas();
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
      this.conductorService.desasignarVehiculo(conductor.id!).subscribe(success => {
        if (success) {
          this.loadConductores();
          this.loadEstadisticas();
        }
      });
    }
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
}