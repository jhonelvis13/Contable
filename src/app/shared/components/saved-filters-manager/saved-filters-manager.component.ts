import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SavedFilter, UserPreferencesService } from '../../../core/services/user-preferences.service';

@Component({
  selector: 'app-saved-filters-manager',
  template: `
    <div class="relative">
      <!-- Botón de filtros guardados -->
      <button
        (click)="toggleDropdown()"
        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <i class="fas fa-bookmark mr-2"></i>
        Filtros Guardados
        <span *ngIf="savedFilters.length > 0" class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {{ savedFilters.length }}
        </span>
        <i class="fas fa-chevron-down ml-2"></i>
      </button>

      <!-- Dropdown de filtros -->
      <div 
        *ngIf="isDropdownOpen"
        class="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        (clickOutside)="closeDropdown()">
        
        <div class="py-1 max-h-96 overflow-y-auto">
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">Filtros Guardados</h3>
              <button
                (click)="showSaveDialog = true"
                class="text-blue-600 hover:text-blue-800 text-sm">
                <i class="fas fa-plus mr-1"></i>
                Guardar Actual
              </button>
            </div>
          </div>

          <!-- Lista de filtros -->
          <div *ngIf="savedFilters.length === 0" class="px-4 py-6 text-center text-gray-500 text-sm">
            <i class="fas fa-bookmark text-2xl mb-2 text-gray-300"></i>
            <p>No hay filtros guardados</p>
            <p class="text-xs mt-1">Configura tus filtros y guárdalos para uso futuro</p>
          </div>

          <div *ngFor="let filter of savedFilters" class="border-b border-gray-100 last:border-b-0">
            <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                 (click)="applyFilter(filter)">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center">
                    <h4 class="text-sm font-medium text-gray-900 truncate">
                      {{ filter.name }}
                    </h4>
                    <span *ngIf="filter.isDefault" 
                          class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Predeterminado
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Actualizado: {{ filter.updatedAt | date:'dd/MM/yyyy' }}
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-xs text-gray-400">
                      <i class="fas fa-filter mr-1"></i>
                      {{ getFilterCount(filter) }} filtros
                    </span>
                    <span class="text-xs text-gray-400">
                      <i class="fas fa-table mr-1"></i>
                      {{ filter.pageSize }} por página
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-1 ml-3">
                  <button
                    (click)="setAsDefault(filter, $event)"
                    [class]="filter.isDefault ? 'text-blue-600' : 'text-gray-400'"
                    class="p-1 hover:text-blue-600"
                    title="Establecer como predeterminado">
                    <i class="fas fa-star text-sm"></i>
                  </button>
                  <button
                    (click)="editFilter(filter, $event)"
                    class="p-1 text-gray-400 hover:text-yellow-600"
                    title="Editar filtro">
                    <i class="fas fa-edit text-sm"></i>
                  </button>
                  <button
                    (click)="deleteFilter(filter, $event)"
                    class="p-1 text-gray-400 hover:text-red-600"
                    title="Eliminar filtro">
                    <i class="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones adicionales -->
          <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <button
                (click)="exportFilters()"
                class="text-xs text-gray-600 hover:text-gray-800">
                <i class="fas fa-download mr-1"></i>
                Exportar
              </button>
              <button
                (click)="showImportDialog = true"
                class="text-xs text-gray-600 hover:text-gray-800">
                <i class="fas fa-upload mr-1"></i>
                Importar
              </button>
              <button
                (click)="clearAllFilters()"
                class="text-xs text-red-600 hover:text-red-800">
                <i class="fas fa-trash-alt mr-1"></i>
                Limpiar Todo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para guardar filtro -->
      <div *ngIf="showSaveDialog" 
           class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="showSaveDialog = false">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Guardar Filtro</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del filtro
              </label>
              <input
                type="text"
                [(ngModel)]="newFilterName"
                placeholder="Ej: Clientes activos 2024"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="setAsDefaultNew"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="ml-2 text-sm text-gray-700">Establecer como predeterminado</span>
              </label>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="showSaveDialog = false"
                class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancelar
              </button>
              <button
                (click)="saveCurrentFilter()"
                [disabled]="!newFilterName.trim()"
                class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de importación -->
      <div *ngIf="showImportDialog" 
           class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="showImportDialog = false">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Importar Filtros</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Archivo JSON de filtros
              </label>
              <input
                type="file"
                accept=".json"
                (change)="onFileSelected($event)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="showImportDialog = false"
                class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancelar
              </button>
              <button
                (click)="importFilters()"
                [disabled]="!selectedFile"
                class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                Importar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .z-50 {
      z-index: 50;
    }
  `]
})
export class SavedFiltersManagerComponent implements OnInit {
  @Input() moduleType!: string;
  @Input() currentFilters: any = {};
  @Input() currentColumnConfig: any[] = [];
  @Input() currentSort: any = {};
  @Input() currentPageSize: number = 25;

  @Output() filterApplied = new EventEmitter<SavedFilter>();
  @Output() filterSaved = new EventEmitter<SavedFilter>();
  @Output() filterDeleted = new EventEmitter<string>();

  savedFilters: SavedFilter[] = [];
  isDropdownOpen = false;
  showSaveDialog = false;
  showImportDialog = false;
  newFilterName = '';
  setAsDefaultNew = false;
  selectedFile: File | null = null;

  constructor(private userPreferencesService: UserPreferencesService) {}

  ngOnInit(): void {
    this.loadSavedFilters();
    
    // Suscribirse a cambios en las preferencias
    this.userPreferencesService.preferences$.subscribe(() => {
      this.loadSavedFilters();
    });
  }

  private loadSavedFilters(): void {
    this.savedFilters = this.userPreferencesService.getSavedFilters(this.moduleType);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  applyFilter(filter: SavedFilter): void {
    this.filterApplied.emit(filter);
    this.closeDropdown();
  }

  setAsDefault(filter: SavedFilter, event: Event): void {
    event.stopPropagation();
    this.userPreferencesService.setDefaultFilter(this.moduleType, filter.id);
  }

  editFilter(filter: SavedFilter, event: Event): void {
    event.stopPropagation();
    this.newFilterName = filter.name;
    this.setAsDefaultNew = filter.isDefault || false;
    this.showSaveDialog = true;
  }

  deleteFilter(filter: SavedFilter, event: Event): void {
    event.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar el filtro "${filter.name}"?`)) {
      this.userPreferencesService.deleteFilter(this.moduleType, filter.id);
      this.filterDeleted.emit(filter.id);
    }
  }

  saveCurrentFilter(): void {
    if (!this.newFilterName.trim()) return;

    const filterId = this.userPreferencesService.saveFilter({
      name: this.newFilterName,
      moduleType: this.moduleType as any,
      filters: this.currentFilters,
      columnConfig: this.currentColumnConfig,
      sortConfig: this.currentSort,
      pageSize: this.currentPageSize,
      isDefault: this.setAsDefaultNew
    });

    // Encontrar el filtro recién guardado
    const savedFilter = this.userPreferencesService.getSavedFilters(this.moduleType)
      .find(f => f.id === filterId);
    
    if (savedFilter) {
      this.filterSaved.emit(savedFilter);
    }

    this.showSaveDialog = false;
    this.newFilterName = '';
    this.setAsDefaultNew = false;
  }

  exportFilters(): void {
    const filters = this.savedFilters;
    const dataStr = JSON.stringify(filters, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `filtros-${this.moduleType}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  importFilters(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const imported = JSON.parse(e.target.result);
        // Aquí podrías implementar lógica de importación más sofisticada
        console.log('Filtros importados:', imported);
        this.showImportDialog = false;
      } catch (error) {
        alert('Error al importar el archivo. Verifica que sea un JSON válido.');
      }
    };
    reader.readAsText(this.selectedFile);
  }

  clearAllFilters(): void {
    if (confirm('¿Estás seguro de que deseas eliminar todos los filtros guardados?')) {
      this.userPreferencesService.clearModulePreferences(this.moduleType);
    }
  }

  getFilterCount(filter: SavedFilter): number {
    return Object.keys(filter.filters || {}).length;
  }
}