// src/app/modules/socios/socio-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocioService } from '../../../core/services/socio.service';
import { Socio } from '../../../core/models/socio.model';

@Component({
  selector: 'app-socio-list',
  templateUrl: './socio-list.component.html',
  styleUrls: ['./socio-list.component.scss']
})
export class SocioListComponent implements OnInit {
  socios: Socio[] = [];
  filteredSocios: Socio[] = [];
  
  // Filtros
  activoFilter: string = '';
  
  // Modal properties
  showModal = false;
  selectedSocio: Socio | null = null;

  constructor(
    private socioService: SocioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSocios();
  }

  loadSocios(): void {
    this.socioService.getSocios().subscribe({
      next: (socios: Socio[]) => {
        this.socios = socios;
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error al cargar socios:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredSocios = this.socios.filter(socio => {
      const activoMatch = !this.activoFilter || 
        (this.activoFilter === 'Activo' && socio.activo) ||
        (this.activoFilter === 'Inactivo' && !socio.activo);
      return activoMatch;
    });
  }

  onActivoFilterChange(event: Event): void {
    this.activoFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  openNewSocioModal(): void {
    this.openModal();
  }

  // Modal handling
  openModal(socio?: Socio): void {
    this.selectedSocio = socio || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSocio = null;
  }

  onSocioSaved(socio: Socio): void {
    this.loadSocios();
    this.closeModal();
  }

  onSocioCreated(socio: Socio): void {
    this.loadSocios();
    this.closeModal();
  }

  viewDetalle(socio: Socio): void {
    this.router.navigate(['/socios', socio.id]);
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return 'Bs 0.00';
    return `Bs ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}