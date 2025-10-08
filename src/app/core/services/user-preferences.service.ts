import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SavedFilter {
  id: string;
  name: string;
  moduleType: 'clientes' | 'conductores' | 'vehiculos' | 'viajes';
  filters: any;
  columnConfig: any[];
  sortConfig?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  pageSize: number;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface UserTablePreferences {
  moduleType: string;
  columnWidths: { [key: string]: number };
  columnOrder: string[];
  hiddenColumns: string[];
  savedFilters: SavedFilter[];
  defaultFilter?: string;
  compactMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // en segundos
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly STORAGE_KEY = 'table_user_preferences';
  private preferencesSubject = new BehaviorSubject<{ [moduleType: string]: UserTablePreferences }>({});
  
  public preferences$ = this.preferencesSubject.asObservable();

  constructor() {
    this.loadPreferences();
  }

  /**
   * Cargar preferencias desde localStorage
   */
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        this.preferencesSubject.next(preferences);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }

  /**
   * Guardar preferencias en localStorage
   */
  private savePreferences(): void {
    try {
      const preferences = this.preferencesSubject.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  /**
   * Obtener preferencias para un módulo específico
   */
  getPreferences(moduleType: string): UserTablePreferences {
    const allPreferences = this.preferencesSubject.value;
    return allPreferences[moduleType] || this.getDefaultPreferences(moduleType);
  }

  /**
   * Obtener preferencias por defecto
   */
  private getDefaultPreferences(moduleType: string): UserTablePreferences {
    return {
      moduleType,
      columnWidths: {},
      columnOrder: [],
      hiddenColumns: [],
      savedFilters: [],
      compactMode: false,
      autoRefresh: false,
      refreshInterval: 30
    };
  }

  /**
   * Actualizar preferencias de un módulo
   */
  updatePreferences(moduleType: string, preferences: Partial<UserTablePreferences>): void {
    const current = this.preferencesSubject.value;
    const modulePrefs = current[moduleType] || this.getDefaultPreferences(moduleType);
    
    current[moduleType] = { ...modulePrefs, ...preferences };
    this.preferencesSubject.next(current);
    this.savePreferences();
  }

  /**
   * Guardar un filtro personalizado
   */
  saveFilter(filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = this.generateId();
    const now = new Date();
    
    const savedFilter: SavedFilter = {
      ...filter,
      id,
      createdAt: now,
      updatedAt: now
    };

    const preferences = this.getPreferences(filter.moduleType);
    preferences.savedFilters.push(savedFilter);
    
    this.updatePreferences(filter.moduleType, { savedFilters: preferences.savedFilters });
    
    return id;
  }

  /**
   * Obtener filtros guardados para un módulo
   */
  getSavedFilters(moduleType: string): SavedFilter[] {
    const preferences = this.getPreferences(moduleType);
    return preferences.savedFilters || [];
  }

  /**
   * Eliminar un filtro guardado
   */
  deleteFilter(moduleType: string, filterId: string): void {
    const preferences = this.getPreferences(moduleType);
    preferences.savedFilters = preferences.savedFilters.filter(f => f.id !== filterId);
    
    this.updatePreferences(moduleType, { savedFilters: preferences.savedFilters });
  }

  /**
   * Actualizar un filtro existente
   */
  updateFilter(moduleType: string, filterId: string, updates: Partial<SavedFilter>): void {
    const preferences = this.getPreferences(moduleType);
    const filterIndex = preferences.savedFilters.findIndex(f => f.id === filterId);
    
    if (filterIndex !== -1) {
      preferences.savedFilters[filterIndex] = {
        ...preferences.savedFilters[filterIndex],
        ...updates,
        updatedAt: new Date()
      };
      
      this.updatePreferences(moduleType, { savedFilters: preferences.savedFilters });
    }
  }

  /**
   * Establecer filtro como predeterminado
   */
  setDefaultFilter(moduleType: string, filterId: string): void {
    const preferences = this.getPreferences(moduleType);
    
    // Remover default de otros filtros
    preferences.savedFilters.forEach(f => f.isDefault = false);
    
    // Establecer nuevo default
    const filter = preferences.savedFilters.find(f => f.id === filterId);
    if (filter) {
      filter.isDefault = true;
      this.updatePreferences(moduleType, { 
        savedFilters: preferences.savedFilters,
        defaultFilter: filterId 
      });
    }
  }

  /**
   * Actualizar anchos de columnas
   */
  updateColumnWidths(moduleType: string, columnWidths: { [key: string]: number }): void {
    this.updatePreferences(moduleType, { columnWidths });
  }

  /**
   * Actualizar orden de columnas
   */
  updateColumnOrder(moduleType: string, columnOrder: string[]): void {
    this.updatePreferences(moduleType, { columnOrder });
  }

  /**
   * Alternar columnas ocultas
   */
  toggleHiddenColumn(moduleType: string, columnKey: string): void {
    const preferences = this.getPreferences(moduleType);
    const hiddenColumns = [...preferences.hiddenColumns];
    
    const index = hiddenColumns.indexOf(columnKey);
    if (index > -1) {
      hiddenColumns.splice(index, 1);
    } else {
      hiddenColumns.push(columnKey);
    }
    
    this.updatePreferences(moduleType, { hiddenColumns });
  }

  /**
   * Configurar modo compacto
   */
  setCompactMode(moduleType: string, compact: boolean): void {
    this.updatePreferences(moduleType, { compactMode: compact });
  }

  /**
   * Configurar auto-refresh
   */
  setAutoRefresh(moduleType: string, enabled: boolean, interval?: number): void {
    const updates: Partial<UserTablePreferences> = { autoRefresh: enabled };
    if (interval) {
      updates.refreshInterval = interval;
    }
    this.updatePreferences(moduleType, updates);
  }

  /**
   * Exportar preferencias (para backup)
   */
  exportPreferences(): string {
    return JSON.stringify(this.preferencesSubject.value, null, 2);
  }

  /**
   * Importar preferencias (desde backup)
   */
  importPreferences(preferencesJson: string): boolean {
    try {
      const preferences = JSON.parse(preferencesJson);
      this.preferencesSubject.next(preferences);
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Error importing preferences:', error);
      return false;
    }
  }

  /**
   * Limpiar todas las preferencias
   */
  clearAllPreferences(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.preferencesSubject.next({});
  }

  /**
   * Limpiar preferencias de un módulo específico
   */
  clearModulePreferences(moduleType: string): void {
    const current = this.preferencesSubject.value;
    delete current[moduleType];
    this.preferencesSubject.next(current);
    this.savePreferences();
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Obtener estadísticas de uso
   */
  getUsageStats(moduleType: string): {
    totalFilters: number;
    customColumns: number;
    lastActivity: Date | null;
  } {
    const preferences = this.getPreferences(moduleType);
    return {
      totalFilters: preferences.savedFilters.length,
      customColumns: Object.keys(preferences.columnWidths).length,
      lastActivity: preferences.savedFilters.length > 0 ? 
        new Date(Math.max(...preferences.savedFilters.map(f => f.updatedAt.getTime()))) : null
    };
  }
}