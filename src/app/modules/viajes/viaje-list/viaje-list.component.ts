// src/app/modules/viajes/viaje-list/viaje-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from '../../../core/services/viaje.service';
import { Viaje } from '../../../core/models/viaje.model';

@Component({
  selector: 'app-viaje-list',
  templateUrl: './viaje-list.component.html',
  styleUrls: ['./viaje-list.component.scss']
})
export class ViajeListComponent implements OnInit {
  viajes: Viaje[] = [];
  filteredViajes: Viaje[] = [];
  
  // Filtros
  estadoFilter: string = '';
  tipoFilter: string = '';
  
  showNewViajeModal = false;

  tableColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'clienteNombre', label: 'Cliente', sortable: true },
    { key: 'producto', label: 'Producto', sortable: false },
    { key: 'tipo', label: 'Tipo', sortable: true },
    { key: 'montoTotal', label: 'Monto Total', sortable: true },
    { key: 'montoPendiente', label: 'Pendiente', sortable: true },
    { key: 'conductorNombre', label: 'Conductor', sortable: false },
    { key: 'vehiculoPlaca', label: 'Vehículo', sortable: false },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  constructor(
    private viajeService: ViajeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadViajes();
  }

  loadViajes(): void {
    this.viajeService.getViajes().subscribe({
      next: (viajes) => {
        this.viajes = viajes;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar viajes:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredViajes = this.viajes.filter(viaje => {
      const estadoMatch = !this.estadoFilter || viaje.estado === this.estadoFilter;
      const tipoMatch = !this.tipoFilter || viaje.tipo === this.tipoFilter;
      return estadoMatch && tipoMatch;
    });
  }

  onEstadoFilterChange(event: Event): void {
    this.estadoFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onTipoFilterChange(event: Event): void {
    this.tipoFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  openNewViajeModal(): void {
    this.showNewViajeModal = true;
  }

  closeNewViajeModal(): void {
    this.showNewViajeModal = false;
  }

  onViajeCreated(viaje: Viaje): void {
    this.loadViajes();
    this.closeNewViajeModal();
  }

  viewDetalle(viaje: Viaje): void {
    this.router.navigate(['/viajes', viaje.id]);
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return 'Bs 0.00';
    return `Bs ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}