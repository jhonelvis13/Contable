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

  // Datos para gráficos
  viajesPorMesData = [
    { label: 'Ene', value: 45, color: '#3B82F6' },
    { label: 'Feb', value: 52, color: '#3B82F6' },
    { label: 'Mar', value: 38, color: '#3B82F6' },
    { label: 'Abr', value: 61, color: '#3B82F6' },
    { label: 'May', value: 55, color: '#3B82F6' },
    { label: 'Jun', value: 67, color: '#3B82F6' }
  ];

  ingresosPorTipoData = [
    { label: 'Nacional', value: 65, color: '#10B981' },
    { label: 'Internacional', value: 35, color: '#3B82F6' }
  ];

  estadoConductoresData = [
    { label: 'Activos', value: 28, color: '#10B981' },
    { label: 'Disponibles', value: 12, color: '#3B82F6' },
    { label: 'En viaje', value: 16, color: '#F59E0B' },
    { label: 'Suspendidos', value: 2, color: '#EF4444' }
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

  navigateToClientesAdvanced(): void {
    this.router.navigate(['/clientes/advanced']);
  }
}
