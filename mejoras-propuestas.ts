// Ejemplo de mejoras que podríamos implementar

export interface MejoraPropuesta {
  categoria: string;
  nombre: string;
  descripcion: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  tiempoEstimado: string;
  beneficios: string[];
}

export const MEJORAS_SUGERIDAS: MejoraPropuesta[] = [
  {
    categoria: 'UX/UI',
    nombre: 'Tema Oscuro/Claro',
    descripcion: 'Implementar modo oscuro y claro con persistencia',
    prioridad: 'Media',
    tiempoEstimado: '2-3 días',
    beneficios: ['Mejor experiencia visual', 'Reduce fatiga ocular', 'Moderniza la app']
  },
  {
    categoria: 'Funcionalidad',
    nombre: 'Sistema de Búsqueda Global',
    descripcion: 'Búsqueda inteligente en todos los módulos',
    prioridad: 'Alta',
    tiempoEstimado: '1 semana',
    beneficios: ['Navegación rápida', 'Mejor productividad', 'UX mejorada']
  },
  {
    categoria: 'Reportes',
    nombre: 'Exportación Avanzada',
    descripcion: 'Exportar a PDF, Excel, CSV con templates personalizados',
    prioridad: 'Alta',
    tiempoEstimado: '1 semana',
    beneficios: ['Reportes profesionales', 'Datos estructurados', 'Compliance']
  },
  {
    categoria: 'Datos',
    nombre: 'Filtros Avanzados',
    descripcion: 'Sistema de filtros combinados y guardado de vistas',
    prioridad: 'Media',
    tiempoEstimado: '4-5 días',
    beneficios: ['Análisis granular', 'Vistas personalizadas', 'Productividad']
  },
  {
    categoria: 'Integración',
    nombre: 'API de Geolocalización',
    descripcion: 'Tracking de vehículos y rutas en tiempo real',
    prioridad: 'Alta',
    tiempoEstimado: '2 semanas',
    beneficios: ['Control en tiempo real', 'Optimización de rutas', 'Seguridad']
  },
  {
    categoria: 'Performance',
    nombre: 'Paginación Virtual',
    descripcion: 'Lazy loading para listas grandes de datos',
    prioridad: 'Media',
    tiempoEstimado: '3-4 días',
    beneficios: ['Mejor rendimiento', 'Carga rápida', 'Escalabilidad']
  },
  {
    categoria: 'Validaciones',
    nombre: 'Validaciones Inteligentes',
    descripcion: 'Validación en tiempo real con sugerencias',
    prioridad: 'Media',
    tiempoEstimado: '3-4 días',
    beneficios: ['Menos errores', 'UX fluida', 'Datos consistentes']
  },
  {
    categoria: 'Workflow',
    nombre: 'Sistema de Aprobaciones',
    descripcion: 'Flujo de aprobación para gastos y anticipos grandes',
    prioridad: 'Alta',
    tiempoEstimado: '1.5 semanas',
    beneficios: ['Control financiero', 'Auditoría', 'Compliance']
  }
];