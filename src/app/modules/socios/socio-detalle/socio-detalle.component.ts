// src/app/modules/socios/socio-detalle.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socio } from '../../../core/models/socio.model';
import { SocioService } from '../../../core/services/socio.service';

@Component({
  selector: 'app-socio-detalle',
  templateUrl: './socio-detalle.component.html',
  styleUrls: ['./socio-detalle.component.scss']
})
export class SocioDetalleComponent implements OnInit {
  socio: Socio | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socioService: SocioService
  ) {}

  ngOnInit(): void {
    this.loadSocio();
  }

  private loadSocio(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/socios']);
      return;
    }

    this.isLoading = true;
    this.socioService.getSocioById(Number(id)).subscribe({
      next: (socio: Socio) => {
        this.socio = socio;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar el socio:', error);
        this.isLoading = false;
        this.router.navigate(['/socios']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/socios']);
  }

  hasCliente(): boolean {
    return this.socio !== null && this.socio !== undefined;
  }

  get socioData(): Socio {
    return this.socio!;
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return 'Bs 0.00';
    return `Bs ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}