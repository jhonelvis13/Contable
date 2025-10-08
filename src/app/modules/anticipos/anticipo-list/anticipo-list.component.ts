import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnticipoService } from '../../../core/services/anticipo.service';
import { Anticipo } from '../../../core/models/anticipo.model';

@Component({
  selector: 'app-anticipo-list',
  templateUrl: './anticipo-list.component.html',
  styleUrls: ['./anticipo-list.component.scss']
})
export class AnticipoListComponent implements OnInit {
  anticipos: Anticipo[] = [];
  filteredAnticipos: Anticipo[] = [];
  
  // Filtros
  tipoFilter: string = '';
  estadoFilter: string = '';
  
  // Modal properties
  showModal = false;
  selectedAnticipo: Anticipo | null = null;

  constructor(
    private anticipoService: AnticipoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnticipos();
  }

  loadAnticipos(): void {
    this.anticipoService.getAnticipos().subscribe({
      next: (anticipos: Anticipo[]) => {
        this.anticipos = anticipos;
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error al cargar anticipos:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredAnticipos = this.anticipos.filter(anticipo => {
      const matchesTipo = !this.tipoFilter || anticipo.tipo === this.tipoFilter;
      const matchesEstado = !this.estadoFilter || anticipo.estado === this.estadoFilter;
      
      return matchesTipo && matchesEstado;
    });
  }

  onTipoFilterChange(): void {
    this.applyFilters();
  }

  onEstadoFilterChange(): void {
    this.applyFilters();
  }

  // Modal handling
  openModal(anticipo?: Anticipo): void {
    this.selectedAnticipo = anticipo || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAnticipo = null;
  }

  onAnticipoSaved(): void {
    this.loadAnticipos();
    this.closeModal();
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return 'Bs 0.00';
    return `Bs ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Parcial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoColor(tipo: string): string {
    switch (tipo) {
      case 'Empresa':
        return 'bg-purple-100 text-purple-800';
      case 'Socio':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Métodos para estadísticas
  getTotalPendiente(): number {
    return this.filteredAnticipos
      .filter(a => a.estado === 'Pendiente')
      .reduce((sum, a) => sum + (a.montoPendiente || 0), 0);
  }

  getTotalPagado(): number {
    return this.filteredAnticipos
      .reduce((sum, a) => sum + (a.montoPagado || 0), 0);
  }

  getCountByTipo(tipo: string): number {
    return this.filteredAnticipos.filter(a => a.tipo === tipo).length;
  }

  getCountByEstado(estado: string): number {
    return this.filteredAnticipos.filter(a => a.estado === estado).length;
  }

  getBadgeVariant(estado: string): 'success' | 'warning' | 'info' | 'secondary' {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Parcial':
        return 'info';
      default:
        return 'secondary';
    }
  }
}