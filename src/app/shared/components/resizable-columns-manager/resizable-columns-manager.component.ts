import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserPreferencesService } from '../../../core/services/user-preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ResizableColumn {
  key: string;
  label: string;
  width: number;
  minWidth: number;
  maxWidth: number;
  visible: boolean;
  resizable: boolean;
  sortable: boolean;
  type?: string;
}

@Component({
  selector: 'app-resizable-columns-manager',
  template: `
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Configuración de Columnas</h3>
        <div class="flex items-center space-x-2">
          <button
            (click)="toggleCompactMode()"
            [class]="compactMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
            class="px-3 py-1 rounded text-sm hover:bg-opacity-80 transition-colors">
            <i class="fas fa-compress-alt mr-1"></i>
            Compacto
          </button>
          <button
            (click)="resetToDefaults()"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
            <i class="fas fa-undo mr-1"></i>
            Restablecer
          </button>
          <button
            (click)="closePanel()"
            class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Drag & Drop Column Reordering -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-900 mb-3">Orden de Columnas</h4>
          <div cdkDropList 
               (cdkDropListDropped)="onColumnReorder($event)"
               class="space-y-2 max-h-64 overflow-y-auto">
            <div *ngFor="let column of columns; trackBy: trackByColumn"
                 cdkDrag
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow"
                 [class.opacity-50]="!column.visible">
              
              <!-- Drag Handle -->
              <div cdkDragHandle class="cursor-move text-gray-400 hover:text-gray-600 mr-3">
                <i class="fas fa-grip-vertical"></i>
              </div>
              
              <!-- Column Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900 truncate">
                    {{ column.label }}
                  </span>
                  <span class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {{ column.type || 'text' }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Ancho: {{ column.width }}px
                  <span *ngIf="column.sortable" class="ml-2">
                    <i class="fas fa-sort mr-1"></i>Ordenable
                  </span>
                </div>
              </div>
              
              <!-- Controls -->
              <div class="flex items-center space-x-2 ml-3">
                <!-- Width Slider -->
                <div class="flex items-center space-x-2" *ngIf="column.visible && column.resizable">
                  <span class="text-xs text-gray-500 w-8">{{ column.minWidth }}</span>
                  <input
                    type="range"
                    [min]="column.minWidth"
                    [max]="column.maxWidth"
                    [value]="column.width"
                    (input)="onColumnWidthChange(column, $event)"
                    class="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
                  <span class="text-xs text-gray-500 w-8">{{ column.maxWidth }}</span>
                </div>
                
                <!-- Visibility Toggle -->
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="column.visible"
                    (change)="onColumnVisibilityChange(column, $event)"
                    class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="border-t border-gray-200 pt-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3">Acciones Rápidas</h4>
          <div class="grid grid-cols-2 gap-3">
            <button
              (click)="showAllColumns()"
              class="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
              <i class="fas fa-eye mr-2"></i>
              Mostrar Todas
            </button>
            <button
              (click)="hideNonEssentialColumns()"
              class="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
              <i class="fas fa-eye-slash mr-2"></i>
              Solo Esenciales
            </button>
            <button
              (click)="autoSizeColumns()"
              class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
              <i class="fas fa-expand-arrows-alt mr-2"></i>
              Ajuste Automático
            </button>
            <button
              (click)="uniformSizeColumns()"
              class="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
              <i class="fas fa-equals mr-2"></i>
              Tamaño Uniforme
            </button>
          </div>
        </div>

        <!-- Column Statistics -->
        <div class="border-t border-gray-200 pt-4 mt-4">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ getVisibleColumnsCount() }}</div>
              <div class="text-xs text-gray-500">Visibles</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ getTotalWidth() }}px</div>
              <div class="text-xs text-gray-500">Ancho Total</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-600">{{ getCustomizedCount() }}</div>
              <div class="text-xs text-gray-500">Personalizadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .slider::-webkit-slider-thumb {
      appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #3B82F6;
      cursor: pointer;
      box-shadow: 0 0 2px 0 #555;
      transition: background .15s ease-in-out;
    }
    
    .slider::-webkit-slider-thumb:hover {
      background: #2563EB;
    }
    
    .slider::-moz-range-thumb {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #3B82F6;
      cursor: pointer;
      border: none;
      box-shadow: 0 0 2px 0 #555;
      transition: background .15s ease-in-out;
    }
    
    .slider::-moz-range-thumb:hover {
      background: #2563EB;
    }
    
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    
    .cdk-drag-placeholder {
      opacity: 0;
    }
    
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    
    .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class ResizableColumnsManagerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() moduleType!: string;
  @Input() initialColumns: ResizableColumn[] = [];
  @Input() compactMode = false;
  
  @Output() columnsChanged = new EventEmitter<ResizableColumn[]>();
  @Output() compactModeChanged = new EventEmitter<boolean>();
  @Output() panelClosed = new EventEmitter<void>();

  @ViewChild('containerRef', { static: false }) containerRef!: ElementRef;

  columns: ResizableColumn[] = [];
  originalColumns: ResizableColumn[] = [];
  private destroy$ = new Subject<void>();

  constructor(private userPreferencesService: UserPreferencesService) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadUserPreferences();
  }

  ngAfterViewInit(): void {
    // Observar cambios de tamaño del contenedor
    if (this.containerRef) {
      const resizeObserver = new ResizeObserver(() => {
        this.onContainerResize();
      });
      resizeObserver.observe(this.containerRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeColumns(): void {
    this.originalColumns = JSON.parse(JSON.stringify(this.initialColumns));
    this.columns = this.initialColumns.map(col => ({
      ...col,
      minWidth: col.minWidth || 80,
      maxWidth: col.maxWidth || 400,
      resizable: col.resizable !== false,
      visible: col.visible !== false
    }));
  }

  private loadUserPreferences(): void {
    const preferences = this.userPreferencesService.getPreferences(this.moduleType);
    
    // Aplicar anchos personalizados
    if (preferences.columnWidths) {
      this.columns.forEach(col => {
        if (preferences.columnWidths[col.key]) {
          col.width = preferences.columnWidths[col.key];
        }
      });
    }
    
    // Aplicar orden personalizado
    if (preferences.columnOrder && preferences.columnOrder.length > 0) {
      const orderedColumns: ResizableColumn[] = [];
      preferences.columnOrder.forEach(key => {
        const column = this.columns.find(col => col.key === key);
        if (column) {
          orderedColumns.push(column);
        }
      });
      // Agregar columnas que no están en el orden personalizado
      this.columns.forEach(col => {
        if (!orderedColumns.find(ordCol => ordCol.key === col.key)) {
          orderedColumns.push(col);
        }
      });
      this.columns = orderedColumns;
    }
    
    // Aplicar columnas ocultas
    if (preferences.hiddenColumns) {
      this.columns.forEach(col => {
        if (preferences.hiddenColumns.includes(col.key)) {
          col.visible = false;
        }
      });
    }
    
    // Aplicar modo compacto
    this.compactMode = preferences.compactMode || false;
  }

  onColumnReorder(event: CdkDragDrop<ResizableColumn[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.saveColumnOrder();
    this.emitChanges();
  }

  onColumnWidthChange(column: ResizableColumn, event: any): void {
    const newWidth = parseInt(event.target.value, 10);
    column.width = Math.max(column.minWidth, Math.min(column.maxWidth, newWidth));
    this.saveColumnWidths();
    this.emitChanges();
  }

  onColumnVisibilityChange(column: ResizableColumn, event: any): void {
    column.visible = event.target.checked;
    this.saveHiddenColumns();
    this.emitChanges();
  }

  toggleCompactMode(): void {
    this.compactMode = !this.compactMode;
    this.userPreferencesService.setCompactMode(this.moduleType, this.compactMode);
    this.compactModeChanged.emit(this.compactMode);
  }

  showAllColumns(): void {
    this.columns.forEach(col => col.visible = true);
    this.saveHiddenColumns();
    this.emitChanges();
  }

  hideNonEssentialColumns(): void {
    const essentialColumns = ['nombre', 'id', 'estado', 'actions'];
    this.columns.forEach(col => {
      col.visible = essentialColumns.includes(col.key) || col.key.includes('nombre');
    });
    this.saveHiddenColumns();
    this.emitChanges();
  }

  autoSizeColumns(): void {
    const totalWidth = this.getTotalAvailableWidth();
    const visibleColumns = this.columns.filter(col => col.visible);
    const averageWidth = Math.floor(totalWidth / visibleColumns.length);
    
    visibleColumns.forEach(col => {
      col.width = Math.max(col.minWidth, Math.min(col.maxWidth, averageWidth));
    });
    
    this.saveColumnWidths();
    this.emitChanges();
  }

  uniformSizeColumns(): void {
    const visibleColumns = this.columns.filter(col => col.visible);
    const uniformWidth = 150;
    
    visibleColumns.forEach(col => {
      col.width = Math.max(col.minWidth, Math.min(col.maxWidth, uniformWidth));
    });
    
    this.saveColumnWidths();
    this.emitChanges();
  }

  resetToDefaults(): void {
    if (confirm('¿Estás seguro de que deseas restablecer todas las columnas a sus valores predeterminados?')) {
      this.columns = JSON.parse(JSON.stringify(this.originalColumns));
      this.userPreferencesService.clearModulePreferences(this.moduleType);
      this.compactMode = false;
      this.emitChanges();
      this.compactModeChanged.emit(this.compactMode);
    }
  }

  closePanel(): void {
    this.panelClosed.emit();
  }

  private saveColumnWidths(): void {
    const columnWidths: { [key: string]: number } = {};
    this.columns.forEach(col => {
      columnWidths[col.key] = col.width;
    });
    this.userPreferencesService.updateColumnWidths(this.moduleType, columnWidths);
  }

  private saveColumnOrder(): void {
    const columnOrder = this.columns.map(col => col.key);
    this.userPreferencesService.updateColumnOrder(this.moduleType, columnOrder);
  }

  private saveHiddenColumns(): void {
    const hiddenColumns = this.columns.filter(col => !col.visible).map(col => col.key);
    this.userPreferencesService.updatePreferences(this.moduleType, { hiddenColumns });
  }

  private emitChanges(): void {
    this.columnsChanged.emit([...this.columns]);
  }

  private onContainerResize(): void {
    // Lógica para ajustar columnas cuando cambia el tamaño del contenedor
    this.autoSizeColumns();
  }

  private getTotalAvailableWidth(): number {
    return this.containerRef?.nativeElement?.offsetWidth || 1200;
  }

  // Utility methods
  trackByColumn(index: number, column: ResizableColumn): string {
    return column.key;
  }

  getVisibleColumnsCount(): number {
    return this.columns.filter(col => col.visible).length;
  }

  getTotalWidth(): number {
    return this.columns.filter(col => col.visible).reduce((sum, col) => sum + col.width, 0);
  }

  getCustomizedCount(): number {
    let customized = 0;
    this.columns.forEach((col, index) => {
      const original = this.originalColumns[index];
      if (original && 
          (col.width !== original.width || col.visible !== original.visible)) {
        customized++;
      }
    });
    return customized;
  }
}