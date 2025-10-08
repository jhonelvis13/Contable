# 🔄 Sistema de Estados de Carga - Guía Completa

## 📋 Resumen del Sistema

El **Sistema de Estados de Carga Mejorados** proporciona una experiencia visual consistente durante las operaciones de carga de datos, con skeleton screens, spinners animados, barras de progreso y overlays de bloqueo.

## 🏗️ Arquitectura del Sistema

### 1. **LoadingService** - Servicio Central
- **Archivo**: `src/app/core/services/loading.service.ts`
- **Propósito**: Gestión centralizada de todos los estados de carga
- **Características**:
  - Múltiples contextos de carga simultáneos
  - Diferentes tipos de loading (skeleton, spinner, progress, overlay)
  - Observables reactivos para componentes
  - Auto-dismiss y gestión de progreso

### 2. **SkeletonComponent** - Placeholder Inteligente
- **Archivo**: `src/app/shared/components/skeleton/skeleton.component.*`
- **Propósito**: Skeleton screens para diferentes tipos de contenido
- **Tipos Soportados**:
  - `table`: Skeletons para tablas con filas y columnas
  - `card`: Skeletons para tarjetas con header, contenido y acciones
  - `list`: Skeletons para listas con avatares y descripciones
  - `text`: Skeletons para párrafos de texto
  - `custom`: Skeleton personalizable

### 3. **LoadingSpinnerComponent** - Indicadores Animados
- **Archivo**: `src/app/shared/components/loading-spinner/loading-spinner.component.*`
- **Propósito**: Spinners animados para operaciones en curso
- **Tipos Disponibles**:
  - `circular`: Spinner circular SVG con animación
  - `dots`: Tres puntos que rebotan
  - `bars`: Barras verticales que se estiran
  - `pulse`: Círculo que pulsa con escala

### 4. **LoadingOverlayComponent** - Overlay Bloqueante
- **Archivo**: `src/app/shared/components/loading-overlay/loading-overlay.component.*`
- **Propósito**: Overlay que bloquea la interfaz durante operaciones críticas
- **Características**:
  - Backdrop con blur opcional
  - Botón de cancelar opcional
  - Z-index configurable
  - Integración con LoadingSpinner

## 🎯 API del LoadingService

### Métodos Principales

```typescript
// Iniciar carga genérica
startLoading(context: string, type: 'skeleton' | 'spinner' | 'progress' | 'overlay', message?: string): void

// Detener carga
stopLoading(context: string): void

// Actualizar progreso (solo para tipo 'progress')
updateProgress(context: string, progress: number, message?: string): void

// Verificar estado de carga
isLoading(context: string): Observable<boolean>
getLoadingState(context: string): Observable<LoadingState | null>
```

### Métodos de Conveniencia

```typescript
// Para cargas de datos (skeleton)
startDataLoading(context: string, message: string): void

// Para operaciones rápidas (spinner)
startOperationLoading(context: string, message: string): void

// Para cargas con progreso
startProgressLoading(context: string, message: string): void

// Para overlay que bloquea toda la pantalla
startOverlayLoading(message: string): void

// Ejecutar operación con loading automático
executeWithLoading<T>(operation: () => Promise<T>, context: string, type: LoadingState['loadingType'], message?: string): Promise<T>

// Simular progreso automático
simulateProgress(context: string, duration: number, onComplete?: () => void): void
```

## 🚀 Uso en Componentes

### 1. **Implementación Básica**

```typescript
import { LoadingService } from '../../../core/services/loading.service';
import { Observable } from 'rxjs';

export class MiComponente implements OnInit {
  isLoading$: Observable<boolean>;
  loadingState$: Observable<LoadingState | null>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.isLoading('mi-contexto');
    this.loadingState$ = this.loadingService.getLoadingState('mi-contexto');
  }

  loadData(): void {
    this.loadingService.startDataLoading('mi-contexto', 'Cargando datos...');
    
    this.dataService.getData().subscribe({
      next: (data) => {
        this.data = data;
        this.loadingService.stopLoading('mi-contexto');
      },
      error: (error) => {
        this.loadingService.stopLoading('mi-contexto');
        // Manejar error
      }
    });
  }
}
```

### 2. **Template con Skeleton**

```html
<!-- Mostrar skeleton mientras carga, sino mostrar contenido -->
<ng-container *ngIf="isLoading$ | async; else contentTemplate">
  <app-skeleton 
    type="table" 
    [rows]="8" 
    [columns]="6"
    [columnWidths]="['35%', '15%', '20%', '10%', '10%', '10%']"
    label="datos">
  </app-skeleton>
</ng-container>

<ng-template #contentTemplate>
  <!-- Contenido real aquí -->
  <table>
    <!-- ... -->
  </table>
</ng-template>
```

### 3. **Spinner para Operaciones**

```html
<!-- Spinner visible solo durante operación -->
<div *ngIf="loadingState$ | async as loadingState" class="loading-container">
  <app-loading-spinner
    [type]="loadingState.loadingType === 'spinner' ? 'circular' : 'dots'"
    [message]="loadingState.loadingMessage || 'Procesando...'"
    [progress]="loadingState.progress"
    [showProgress]="loadingState.loadingType === 'progress'"
    [color]="'primary'"
    [size]="30">
  </app-loading-spinner>
</div>
```

### 4. **Overlay Bloqueante**

```html
<!-- Overlay que bloquea toda la pantalla -->
<app-loading-overlay
  [show]="showOverlay"
  [message]="'Guardando cambios importantes...'"
  [spinnerType]="'circular'"
  [spinnerSize]="60"
  [backdrop]="true"
  [blur]="true"
  [showCancelButton]="false"
  [color]="'primary'">
</app-loading-overlay>
```

## 🎨 Configuraciones del SkeletonComponent

### Propiedades Principales

```typescript
@Input() type: 'table' | 'card' | 'list' | 'text' | 'custom' = 'card';
@Input() rows: number = 5;           // Para tipo 'table'
@Input() columns: number = 4;        // Para tipo 'table'
@Input() lines: number = 3;          // Para tipos 'card', 'text'
@Input() items: number = 5;          // Para tipo 'list'

// Opciones de visualización
@Input() showHeader: boolean = true;
@Input() showAvatar: boolean = false;
@Input() showSubtitle: boolean = true;
@Input() showActions: boolean = false;

// Personalización de anchos
@Input() columnWidths: string[] = [];  // Ej: ['20%', '30%', '50%']
@Input() lineWidths: string[] = [];    // Ej: ['100%', '85%', '70%']
```

### Ejemplos de Uso

```html
<!-- Skeleton para tabla -->
<app-skeleton 
  type="table" 
  [rows]="8" 
  [columns]="6"
  [columnWidths]="['35%', '15%', '20%', '10%', '10%', '10%']">
</app-skeleton>

<!-- Skeleton para tarjetas -->
<app-skeleton 
  type="card" 
  [showHeader]="true"
  [showAvatar]="true"
  [lines]="3"
  [showActions]="true">
</app-skeleton>

<!-- Skeleton para lista -->
<app-skeleton 
  type="list" 
  [items]="6"
  [showAvatar]="true"
  [showSubtitle]="true"
  [showDescription]="true">
</app-skeleton>
```

## ⚡ LoadingSpinnerComponent Configuraciones

### Propiedades

```typescript
@Input() type: 'circular' | 'dots' | 'bars' | 'pulse' = 'circular';
@Input() size: number = 40;
@Input() message: string = '';
@Input() progress: number | undefined = undefined;
@Input() showProgress: boolean = false;
@Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
```

### Ejemplos

```html
<!-- Spinner circular básico -->
<app-loading-spinner 
  type="circular" 
  message="Cargando datos..." 
  [size]="40">
</app-loading-spinner>

<!-- Spinner con progreso -->
<app-loading-spinner 
  type="circular" 
  message="Subiendo archivo..." 
  [progress]="75"
  [showProgress]="true"
  color="success"
  [size]="50">
</app-loading-spinner>

<!-- Spinner de puntos pequeño -->
<app-loading-spinner 
  type="dots" 
  message="Procesando..." 
  [size]="24"
  color="warning">
</app-loading-spinner>
```

## 🔒 LoadingOverlayComponent Configuraciones

### Propiedades

```typescript
@Input() show: boolean = false;
@Input() message: string = 'Cargando...';
@Input() spinnerType: 'circular' | 'dots' | 'bars' | 'pulse' = 'circular';
@Input() spinnerSize: number = 50;
@Input() backdrop: boolean = true;
@Input() blur: boolean = false;
@Input() showCancelButton: boolean = false;
@Input() cancelText: string = 'Cancelar';
@Input() allowBackdropCancel: boolean = false;
```

## 📊 Patrones de Uso Recomendados

### 1. **Carga de Datos Inicial**
```typescript
ngOnInit(): void {
  this.loadData();
}

loadData(): void {
  this.loadingService.startDataLoading('data-load', 'Cargando información...');
  // Usar skeleton en template
}
```

### 2. **Operaciones del Usuario**
```typescript
save(): void {
  this.loadingService.startOperationLoading('save-operation', 'Guardando...');
  // Usar spinner pequeño en botón o modal
}
```

### 3. **Cargas con Progreso**
```typescript
uploadFile(): void {
  this.loadingService.startProgressLoading('file-upload', 'Subiendo archivo...');
  // Actualizar progreso manualmente o usar simulateProgress
}
```

### 4. **Operaciones Bloqueantes**
```typescript
criticalOperation(): void {
  this.showOverlay = true;
  this.loadingService.startOverlayLoading('Procesando cambios críticos...');
  // Bloquea toda la interfaz
}
```

## 🎯 Mejores Prácticas

### 1. **Contextos Únicos**
- Use contextos descriptivos: `'vehiculos-list'`, `'user-save'`, `'file-upload'`
- Un contexto por operación para evitar conflictos

### 2. **Mensajes Descriptivos**
- Sea específico: `'Cargando vehículos...'` en lugar de `'Cargando...'`
- Use verbos en gerundio: `'Guardando'`, `'Procesando'`, `'Conectando'`

### 3. **Tipos Apropiados**
- **Skeleton**: Carga inicial de datos, reemplazo 1:1 del contenido
- **Spinner**: Operaciones rápidas, botones, operaciones en curso
- **Progress**: Cargas de archivos, operaciones largas con progreso conocido
- **Overlay**: Operaciones críticas que requieren bloquear la UI

### 4. **Gestión de Errores**
```typescript
try {
  this.loadingService.startDataLoading('context', 'Cargando...');
  const result = await this.service.getData();
  // Procesar resultado
} catch (error) {
  // Manejar error
} finally {
  this.loadingService.stopLoading('context'); // Siempre detener
}
```

### 5. **Cleanup en Componentes**
```typescript
ngOnDestroy(): void {
  // Detener todas las cargas del componente
  this.loadingService.stopLoading('mi-contexto');
}
```

## 🌟 Funcionalidades Avanzadas

### 1. **Wrapper para Operaciones Automáticas**
```typescript
async processData(): Promise<void> {
  await this.loadingService.executeWithLoading(
    () => this.dataService.processData(),
    'data-process',
    'spinner',
    'Procesando datos...'
  );
}
```

### 2. **Progreso Simulado**
```typescript
simulateUpload(): void {
  this.loadingService.simulateProgress('upload', 5000, () => {
    this.toastService.success('Subida completada');
  });
}
```

### 3. **Estados Múltiples**
```typescript
// Diferentes partes de la UI pueden tener estados independientes
this.isLoadingData$ = this.loadingService.isLoading('data');
this.isLoadingStats$ = this.loadingService.isLoading('stats');
this.isProcessing$ = this.loadingService.isLoading('process');
```

## 🚀 Demostración en Vehículos Module

En el módulo de vehículos (`/vehiculos`) encontrarás botones de demostración:

- **💀 Skeleton**: Demuestra skeleton de tabla
- **⟲ Spinner**: Demuestra spinner de operación
- **📊 Progreso**: Demuestra barra de progreso
- **🔒 Overlay**: Demuestra overlay bloqueante
- **⚡ Error Loading**: Demuestra loading con error

## 📈 Beneficios del Sistema

1. **UX Mejorada**: Los usuarios ven placeholders realistas en lugar de pantallas vacías
2. **Feedback Visual**: Indicadores claros del progreso de las operaciones
3. **Consistencia**: Misma experiencia de carga en toda la aplicación
4. **Flexibilidad**: Múltiples tipos de loading para diferentes contextos
5. **Accesibilidad**: Componentes con aria-labels y soporte para reduced-motion
6. **Responsivo**: Todos los componentes se adaptan a diferentes tamaños de pantalla

## 🔧 Próximas Mejoras Sugeridas

1. **Estados de Error**: Skeleton screens para estados de error con retry
2. **Lazy Loading**: Integración con lazy loading de módulos
3. **Intersección Observer**: Skeletons que aparecen solo cuando son visibles
4. **Animaciones Personalizadas**: Más tipos de animaciones para skeleton
5. **Presets de Configuración**: Configuraciones predefinidas para casos comunes

---

## ✅ Sistema Completamente Implementado

El **Sistema de Estados de Carga Mejorados** está **100% funcional** y listo para uso en producción. Todos los componentes están integrados en el `SharedModule` y disponibles en toda la aplicación.

**Próximo en la lista**: **Filtros Avanzados en Tablas** - Sistema de filtrado con operadores y exportación de datos.