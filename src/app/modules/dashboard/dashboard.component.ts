import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../core/services/viaje.service';
import { Viaje } from '../../core/models/viaje.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  metrics = {
    totalViajes: 0,
    ingresosEgresos: { ingresos: 0, egresos: 0 },
    anticiposPendientes: 0,
    montoFacturado: 0
  };

  barData = [
    { month: 'Ene', value: 80 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 90 },
    { month: 'Abr', value: 70 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 75 }
  ];

  ultimosViajes: Viaje[] = [];
  
  columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'clienteNombre', label: 'Cliente', sortable: true },
    { key: 'fechaInicio', label: 'Fecha', sortable: true },
    { key: 'montoTotal', label: 'Monto', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  constructor(
    private viajeService: ViajeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.viajeService.getViajes().subscribe({
      next: (viajes: Viaje[]) => {
        this.ultimosViajes = viajes.slice(-5).reverse();
        
        // Calcular métricas
        const fechaActual = new Date();
        const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        
        const viajesDelMes = viajes.filter(viaje => 
          viaje.fechaInicio && new Date(viaje.fechaInicio) >= inicioMes
        );
        
        this.metrics.totalViajes = viajesDelMes.length;
        const totalIngresos = viajesDelMes.reduce((sum, viaje) => sum + (viaje.montoTotal || 0), 0);
        this.metrics.ingresosEgresos.ingresos = totalIngresos;
        this.metrics.ingresosEgresos.egresos = Math.round(totalIngresos * 0.4);
        this.metrics.montoFacturado = viajes.reduce((sum, viaje) => sum + (viaje.montoTotal || 0), 0);
        this.metrics.anticiposPendientes = Math.round(totalIngresos * 0.15);
      },
      error: (error: any) => {
        console.error('Error al cargar datos del dashboard:', error);
      }
    });
  }

  navigateToViajes(): void {
    this.router.navigate(['/viajes']);
  }
}
