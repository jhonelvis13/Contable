import { Component, OnInit } from '@angular/core';

interface ConfiguracionItem {
  categoria: string;
  nombre: string;
  descripcion: string;
  valor: string | number | boolean;
  tipo: 'text' | 'number' | 'boolean' | 'select' | 'password';
  opciones?: string[];
  icono: string;
}

@Component({
  selector: 'app-configuracion-list',
  templateUrl: './configuracion-list.component.html',
  styleUrls: ['./configuracion-list.component.scss']
})
export class ConfiguracionListComponent implements OnInit {
  
  categorias = ['Sistema', 'Seguridad', 'Notificaciones', 'Reportes', 'Integración'];
  categoriaSeleccionada = 'Sistema';
  
  configuraciones: ConfiguracionItem[] = [
    // Sistema
    {
      categoria: 'Sistema',
      nombre: 'Nombre de la Empresa',
      descripcion: 'Nombre oficial de la empresa de transporte',
      valor: 'Transportes SRL',
      tipo: 'text',
      icono: 'fas fa-building'
    },
    {
      categoria: 'Sistema',
      nombre: 'Moneda por Defecto',
      descripcion: 'Moneda utilizada en el sistema',
      valor: 'PEN',
      tipo: 'select',
      opciones: ['PEN', 'USD', 'EUR'],
      icono: 'fas fa-coins'
    },
    {
      categoria: 'Sistema',
      nombre: 'Zona Horaria',
      descripcion: 'Zona horaria del sistema',
      valor: 'America/Lima',
      tipo: 'select',
      opciones: ['America/Lima', 'America/Bogota', 'America/Mexico_City'],
      icono: 'fas fa-clock'
    },
    // Seguridad
    {
      categoria: 'Seguridad',
      nombre: 'Tiempo de Sesión (minutos)',
      descripcion: 'Tiempo antes de cerrar sesión automáticamente',
      valor: 60,
      tipo: 'number',
      icono: 'fas fa-shield-alt'
    },
    {
      categoria: 'Seguridad',
      nombre: 'Requerir Cambio de Contraseña',
      descripcion: 'Obligar a cambiar contraseña periódicamente',
      valor: true,
      tipo: 'boolean',
      icono: 'fas fa-key'
    },
    {
      categoria: 'Seguridad',
      nombre: 'Días para Cambio de Contraseña',
      descripcion: 'Cada cuántos días cambiar la contraseña',
      valor: 90,
      tipo: 'number',
      icono: 'fas fa-calendar-alt'
    },
    // Notificaciones
    {
      categoria: 'Notificaciones',
      nombre: 'Email de Administrador',
      descripcion: 'Correo del administrador del sistema',
      valor: 'admin@transportes.com',
      tipo: 'text',
      icono: 'fas fa-envelope'
    },
    {
      categoria: 'Notificaciones',
      nombre: 'Notificar Vencimientos',
      descripcion: 'Enviar alertas por vencimientos de documentos',
      valor: true,
      tipo: 'boolean',
      icono: 'fas fa-bell'
    },
    {
      categoria: 'Notificaciones',
      nombre: 'Días de Anticipación',
      descripcion: 'Días antes del vencimiento para notificar',
      valor: 15,
      tipo: 'number',
      icono: 'fas fa-exclamation-triangle'
    },
    // Reportes
    {
      categoria: 'Reportes',
      nombre: 'Formato de Fecha',
      descripcion: 'Formato de fecha en reportes',
      valor: 'DD/MM/YYYY',
      tipo: 'select',
      opciones: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
      icono: 'fas fa-calendar'
    },
    {
      categoria: 'Reportes',
      nombre: 'Incluir Logo en Reportes',
      descripcion: 'Mostrar logo de la empresa en reportes',
      valor: true,
      tipo: 'boolean',
      icono: 'fas fa-image'
    },
    {
      categoria: 'Reportes',
      nombre: 'Registros por Página',
      descripcion: 'Número de registros por página en listados',
      valor: 25,
      tipo: 'number',
      icono: 'fas fa-list'
    },
    // Integración
    {
      categoria: 'Integración',
      nombre: 'API de Mapas Habilitada',
      descripcion: 'Habilitar integración con servicios de mapas',
      valor: true,
      tipo: 'boolean',
      icono: 'fas fa-map'
    },
    {
      categoria: 'Integración',
      nombre: 'Clave API de Mapas',
      descripcion: 'Clave para servicios de geolocalización',
      valor: '*********************',
      tipo: 'password',
      icono: 'fas fa-key'
    },
    {
      categoria: 'Integración',
      nombre: 'Sincronización Automática',
      descripcion: 'Sincronizar datos automáticamente',
      valor: false,
      tipo: 'boolean',
      icono: 'fas fa-sync'
    }
  ];

  configuracionesFiltradas: ConfiguracionItem[] = [];
  
  // Propiedades auxiliares
  fechaActual = new Date().toLocaleDateString();

  ngOnInit(): void {
    this.filtrarPorCategoria();
  }

  filtrarPorCategoria(): void {
    this.configuracionesFiltradas = this.configuraciones.filter(
      config => config.categoria === this.categoriaSeleccionada
    );
  }

  onCategoriaChange(): void {
    this.filtrarPorCategoria();
  }

  onValorChange(configuracion: ConfiguracionItem, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    let nuevoValor: any;
    
    if (target.type === 'checkbox') {
      nuevoValor = (target as HTMLInputElement).checked;
    } else if (target.type === 'number') {
      nuevoValor = parseFloat(target.value) || 0;
    } else {
      nuevoValor = target.value;
    }
    
    configuracion.valor = nuevoValor;
    console.log(`Configuración actualizada: ${configuracion.nombre} = ${nuevoValor}`);
    // Aquí implementarías la lógica para guardar en el backend
  }

  guardarConfiguraciones(): void {
    console.log('Guardando configuraciones...', this.configuraciones);
    // Implementar lógica de guardado
    alert('Configuraciones guardadas exitosamente');
  }

  restaurarDefecto(): void {
    if (confirm('¿Está seguro de restaurar la configuración por defecto?')) {
      console.log('Restaurando configuración por defecto...');
      // Implementar lógica de restauración
      alert('Configuración restaurada por defecto');
    }
  }

  exportarConfiguracion(): void {
    const dataStr = JSON.stringify(this.configuraciones, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'configuracion-transportes.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  importarConfiguracion(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const config = JSON.parse(e.target.result);
          this.configuraciones = config;
          this.filtrarPorCategoria();
          alert('Configuración importada exitosamente');
        } catch (error) {
          alert('Error al importar configuración');
        }
      };
      reader.readAsText(file);
    }
  }
}