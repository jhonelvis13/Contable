import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface AdvancedFilter {
  field: string;
  operator: 'eq' | 'ne' | 'lt' | 'le' | 'gt' | 'ge' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'between';
  value: any;
  dataType?: 'string' | 'number' | 'date' | 'boolean';
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

export interface AdvancedQueryParams {
  filters: AdvancedFilter[];
  sorting: SortConfig[];
  pagination: PaginationConfig;
  search?: string;
  includes?: string[]; // Para incluir relaciones
  aggregations?: string[]; // Para obtener estadísticas
}

export interface AdvancedQueryResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  aggregations?: { [key: string]: any };
  executionTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedApiService {
  private baseUrl = '/api'; // Configurar según tu API
  
  // Subjects para reactive queries
  private filtersSubject = new BehaviorSubject<AdvancedFilter[]>([]);
  private sortingSubject = new BehaviorSubject<SortConfig[]>([]);
  private paginationSubject = new BehaviorSubject<PaginationConfig>({ page: 1, pageSize: 25 });
  private searchSubject = new BehaviorSubject<string>('');
  
  constructor(private http: HttpClient) {}

  /**
   * Ejecutar consulta avanzada con filtros reactivos
   */
  createAdvancedQuery<T>(endpoint: string): Observable<AdvancedQueryResponse<T>> {
    return combineLatest([
      this.filtersSubject.asObservable(),
      this.sortingSubject.asObservable(),
      this.paginationSubject.asObservable(),
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
    ]).pipe(
      switchMap(([filters, sorting, pagination, search]) => {
        const queryParams: AdvancedQueryParams = {
          filters,
          sorting,
          pagination,
          search: search || undefined
        };
        
        return this.executeQuery<T>(endpoint, queryParams);
      })
    );
  }

  /**
   * Ejecutar consulta directa
   */
  executeQuery<T>(endpoint: string, params: AdvancedQueryParams): Observable<AdvancedQueryResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    
    return this.http.get<AdvancedQueryResponse<T>>(`${this.baseUrl}${endpoint}`, { params: httpParams })
      .pipe(
        map(response => ({
          ...response,
          executionTime: response.executionTime || 0
        }))
      );
  }

  /**
   * Actualizar filtros
   */
  updateFilters(filters: AdvancedFilter[]): void {
    this.filtersSubject.next(filters);
  }

  /**
   * Agregar filtro
   */
  addFilter(filter: AdvancedFilter): void {
    const current = this.filtersSubject.value;
    const existing = current.findIndex(f => f.field === filter.field && f.operator === filter.operator);
    
    if (existing >= 0) {
      current[existing] = filter;
    } else {
      current.push(filter);
    }
    
    this.filtersSubject.next([...current]);
  }

  /**
   * Remover filtro
   */
  removeFilter(field: string, operator?: string): void {
    const current = this.filtersSubject.value;
    const filtered = operator 
      ? current.filter(f => !(f.field === field && f.operator === operator))
      : current.filter(f => f.field !== field);
    
    this.filtersSubject.next(filtered);
  }

  /**
   * Limpiar todos los filtros
   */
  clearFilters(): void {
    this.filtersSubject.next([]);
  }

  /**
   * Actualizar ordenamiento
   */
  updateSorting(sorting: SortConfig[]): void {
    this.sortingSubject.next(sorting);
  }

  /**
   * Agregar ordenamiento
   */
  addSort(field: string, direction: 'asc' | 'desc', multiSort = false): void {
    const current = multiSort ? this.sortingSubject.value : [];
    const existing = current.findIndex(s => s.field === field);
    
    if (existing >= 0) {
      current[existing].direction = direction;
    } else {
      current.push({ field, direction });
    }
    
    this.sortingSubject.next([...current]);
  }

  /**
   * Remover ordenamiento
   */
  removeSort(field: string): void {
    const current = this.sortingSubject.value;
    const filtered = current.filter(s => s.field !== field);
    this.sortingSubject.next(filtered);
  }

  /**
   * Actualizar paginación
   */
  updatePagination(pagination: Partial<PaginationConfig>): void {
    const current = this.paginationSubject.value;
    this.paginationSubject.next({ ...current, ...pagination });
  }

  /**
   * Ir a página específica
   */
  goToPage(page: number): void {
    this.updatePagination({ page });
  }

  /**
   * Cambiar tamaño de página
   */
  changePageSize(pageSize: number): void {
    this.updatePagination({ page: 1, pageSize });
  }

  /**
   * Actualizar búsqueda global
   */
  updateSearch(search: string): void {
    this.searchSubject.next(search);
  }

  /**
   * Obtener estado actual de los filtros
   */
  getCurrentFilters(): AdvancedFilter[] {
    return this.filtersSubject.value;
  }

  /**
   * Obtener estado actual del ordenamiento
   */
  getCurrentSorting(): SortConfig[] {
    return this.sortingSubject.value;
  }

  /**
   * Obtener estado actual de la paginación
   */
  getCurrentPagination(): PaginationConfig {
    return this.paginationSubject.value;
  }

  /**
   * Obtener búsqueda actual
   */
  getCurrentSearch(): string {
    return this.searchSubject.value;
  }

  /**
   * Exportar datos con filtros aplicados
   */
  exportData<T>(endpoint: string, format: 'excel' | 'csv' | 'pdf' = 'excel'): Observable<Blob> {
    const params: AdvancedQueryParams = {
      filters: this.getCurrentFilters(),
      sorting: this.getCurrentSorting(),
      pagination: { page: 1, pageSize: 999999 }, // Obtener todos los registros
      search: this.getCurrentSearch()
    };
    
    const httpParams = this.buildHttpParams(params);
    httpParams.set('format', format);
    
    return this.http.get(`${this.baseUrl}${endpoint}/export`, { 
      params: httpParams,
      responseType: 'blob'
    });
  }

  /**
   * Obtener estadísticas con filtros aplicados
   */
  getStatistics(endpoint: string, aggregations: string[]): Observable<{ [key: string]: any }> {
    const params: AdvancedQueryParams = {
      filters: this.getCurrentFilters(),
      sorting: [],
      pagination: { page: 1, pageSize: 1 },
      search: this.getCurrentSearch(),
      aggregations
    };
    
    const httpParams = this.buildHttpParams(params);
    
    return this.http.get<{ aggregations: any }>(`${this.baseUrl}${endpoint}/stats`, { params: httpParams })
      .pipe(map(response => response.aggregations || {}));
  }

  /**
   * Construir HttpParams desde AdvancedQueryParams
   */
  private buildHttpParams(params: AdvancedQueryParams): HttpParams {
    let httpParams = new HttpParams();
    
    // Filtros
    if (params.filters && params.filters.length > 0) {
      httpParams = httpParams.set('filters', JSON.stringify(params.filters));
    }
    
    // Ordenamiento
    if (params.sorting && params.sorting.length > 0) {
      httpParams = httpParams.set('sorting', JSON.stringify(params.sorting));
    }
    
    // Paginación
    httpParams = httpParams.set('page', params.pagination.page.toString());
    httpParams = httpParams.set('pageSize', params.pagination.pageSize.toString());
    
    // Búsqueda global
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    
    // Includes
    if (params.includes && params.includes.length > 0) {
      httpParams = httpParams.set('includes', params.includes.join(','));
    }
    
    // Agregaciones
    if (params.aggregations && params.aggregations.length > 0) {
      httpParams = httpParams.set('aggregations', params.aggregations.join(','));
    }
    
    return httpParams;
  }

  /**
   * Crear filtros desde valores de formulario
   */
  createFiltersFromForm(formValues: any, fieldMappings: { [key: string]: { field: string, operator?: string, dataType?: string } }): AdvancedFilter[] {
    const filters: AdvancedFilter[] = [];
    
    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      const mapping = fieldMappings[key];
      
      if (value !== null && value !== undefined && value !== '' && mapping) {
        filters.push({
          field: mapping.field,
          operator: mapping.operator as any || 'eq',
          value,
          dataType: mapping.dataType as any || 'string'
        });
      }
    });
    
    return filters;
  }

  /**
   * Crear filtro de rango de fechas
   */
  createDateRangeFilter(field: string, startDate: Date | null, endDate: Date | null): AdvancedFilter | null {
    if (!startDate && !endDate) return null;
    
    if (startDate && endDate) {
      return {
        field,
        operator: 'between',
        value: [startDate.toISOString(), endDate.toISOString()],
        dataType: 'date'
      };
    } else if (startDate) {
      return {
        field,
        operator: 'ge',
        value: startDate.toISOString(),
        dataType: 'date'
      };
    } else {
      return {
        field,
        operator: 'le',
        value: endDate!.toISOString(),
        dataType: 'date'
      };
    }
  }

  /**
   * Crear filtro de valores múltiples
   */
  createMultiValueFilter(field: string, values: any[]): AdvancedFilter | null {
    if (!values || values.length === 0) return null;
    
    return {
      field,
      operator: 'in',
      value: values
    };
  }

  /**
   * Reset completo de la consulta
   */
  resetQuery(): void {
    this.filtersSubject.next([]);
    this.sortingSubject.next([]);
    this.paginationSubject.next({ page: 1, pageSize: 25 });
    this.searchSubject.next('');
  }
}