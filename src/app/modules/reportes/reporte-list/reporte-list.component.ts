import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-list',
  templateUrl: './reporte-list.component.html',
  styleUrls: ['./reporte-list.component.scss']
})
export class ReporteListComponent implements OnInit {
  
  reportes = [
    {
      id: 1,
      titulo: 'Reporte de Viajes',
      descripcion: 'Reporte detallado de todos los viajes realizados por período',
      icono: 'route',
      categoria: 'Operaciones',
      ultimaGeneracion: new Date('2024-01-10')
    },
    {
      id: 2,
      titulo: 'Reporte Financiero',
      descripcion: 'Estado financiero con ingresos, gastos y utilidades',
      icono: 'currency',
      categoria: 'Finanzas',
      ultimaGeneracion: new Date('2024-01-09')
    },
    {
      id: 3,
      titulo: 'Reporte de Conductores',
      descripcion: 'Rendimiento y estadísticas de conductores',
      icono: 'users',
      categoria: 'Personal',
      ultimaGeneracion: new Date('2024-01-08')
    },
    {
      id: 4,
      titulo: 'Reporte de Vehículos',
      descripcion: 'Estado de la flota vehicular y mantenimientos',
      icono: 'truck',
      categoria: 'Flota',
      ultimaGeneracion: new Date('2024-01-07')
    },
    {
      id: 5,
      titulo: 'Reporte de Clientes',
      descripcion: 'Análisis de clientes y frecuencia de servicios',
      icono: 'building',
      categoria: 'Comercial',
      ultimaGeneracion: new Date('2024-01-06')
    },
    {
      id: 6,
      titulo: 'Reporte de Socios',
      descripcion: 'Rendimiento y participación de socios',
      icono: 'handshake',
      categoria: 'Socios',
      ultimaGeneracion: new Date('2024-01-05')
    }
  ];

  categorias = ['Todos', 'Operaciones', 'Finanzas', 'Personal', 'Flota', 'Comercial', 'Socios'];
  categoriaSeleccionada = 'Todos';
  
  // Filtros para reportes
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor() { }

  ngOnInit(): void {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    
    this.fechaInicio = mesAnterior.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];
  }

  get reportesFiltrados() {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.reportes;
    }
    return this.reportes.filter(reporte => reporte.categoria === this.categoriaSeleccionada);
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }

  generarReporte(reporte: any): void {
    console.log('Generando reporte:', reporte.titulo);
    console.log('Período:', this.fechaInicio, 'a', this.fechaFin);
    
    // Aquí se implementaría la lógica para generar el reporte
    // Por ahora solo mostramos un mensaje
    alert(`Generando ${reporte.titulo} desde ${this.fechaInicio} hasta ${this.fechaFin}`);
  }

  exportarReporte(reporte: any, formato: string): void {
    console.log('Exportando reporte:', reporte.titulo, 'en formato:', formato);
    
    // Aquí se implementaría la lógica para exportar
    alert(`Exportando ${reporte.titulo} en formato ${formato.toUpperCase()}`);
  }

  getIconoSvg(icono: string): string {
    const iconos: { [key: string]: string } = {
      route: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      currency: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      truck: 'M8 9l4-4 4 4m0 6l-4 4-4-4',
      building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      handshake: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0H8m8 0v2m0-2H8m0 0v2m0-2H4a1 1 0 00-1 1v14a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1z'
    };
    return iconos[icono] || iconos['route'];
  }

  getCategoriaColor(categoria: string): string {
    const colores: { [key: string]: string } = {
      'Operaciones': 'bg-blue-100 text-blue-800',
      'Finanzas': 'bg-green-100 text-green-800',
      'Personal': 'bg-purple-100 text-purple-800',
      'Flota': 'bg-orange-100 text-orange-800',
      'Comercial': 'bg-indigo-100 text-indigo-800',
      'Socios': 'bg-yellow-100 text-yellow-800'
    };
    return colores[categoria] || 'bg-gray-100 text-gray-800';
  }
}