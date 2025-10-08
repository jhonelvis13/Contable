import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export interface AdvancedTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'currency' | 'badge' | 'actions' | 'boolean';
  badgeColors?: { [key: string]: string };
  format?: (value: any) => string;
  exportable?: boolean;
}

export interface TableFilter {
  column: string;
  type: 'text' | 'select' | 'date' | 'number' | 'range';
  value: any;
  options?: { label: string; value: any }[];
}

export interface ExportOptions {
  filename?: string;
  title?: string;
  includeDate?: boolean;
  selectedOnly?: boolean;
}

@Component({
  selector: 'app-advanced-data-table',
  template: `
    <div class="advanced-data-table bg-white rounded-lg shadow-md">
      <!-- Header con controles -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <!-- Título y búsqueda -->
          <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h3 *ngIf="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            
            <!-- Buscador global -->
            <div *ngIf="searchable" class="relative">
              <input
                type="text"
                [(ngModel)]="globalSearchTerm"
                (input)="onGlobalSearch()"
                placeholder="Buscar en todos los campos..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <!-- Controles de exportación y configuración -->
          <div class="flex items-center space-x-2">
            <!-- Selector de filas por página -->
            <select
              [(ngModel)]="pageSize"
              (change)="onPageSizeChange()"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option [value]="10">10 filas</option>
              <option [value]="25">25 filas</option>
              <option [value]="50">50 filas</option>
              <option [value]="100">100 filas</option>
            </select>

            <!-- Botones de exportación -->
            <div class="flex items-center space-x-1">
              <button
                (click)="exportToExcel()"
                class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                title="Exportar a Excel">
                <i class="fas fa-file-excel mr-1"></i>
                Excel
              </button>
              
              <button
                (click)="exportToPDF()"
                class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                title="Exportar a PDF">
                <i class="fas fa-file-pdf mr-1"></i>
                PDF
              </button>
            </div>

            <!-- Toggle filtros avanzados -->
            <button
              (click)="showAdvancedFilters = !showAdvancedFilters"
              class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center"
              [class.bg-blue-50]="showAdvancedFilters"
              [class.text-blue-600]="showAdvancedFilters">
              <i class="fas fa-filter mr-1"></i>
              Filtros
            </button>
            
            <!-- Reset filtros -->
            <button
              *ngIf="hasActiveFilters()"
              (click)="clearAllFilters()"
              class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Filtros avanzados -->
        <div *ngIf="showAdvancedFilters" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div *ngFor="let column of filterableColumns" class="space-y-1">
              <label class="text-sm font-medium text-gray-700">{{ column.label }}</label>
              
              <!-- Filtro de texto -->
              <input
                *ngIf="getFilterType(column) === 'text'"
                type="text"
                [(ngModel)]="columnFilters[column.key]"
                (input)="applyFilters()"
                placeholder="Filtrar {{ column.label.toLowerCase() }}..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
              
              <!-- Filtro de select -->
              <select
                *ngIf="getFilterType(column) === 'select'"
                [(ngModel)]="columnFilters[column.key]"
                (change)="applyFilters()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                <option *ngFor="let option of getUniqueValues(column.key)" [value]="option">
                  {{ option }}
                </option>
              </select>
              
              <!-- Filtro de número -->
              <div *ngIf="getFilterType(column) === 'number'" class="flex space-x-2">
                <input
                  type="number"
                  [(ngModel)]="columnFilters[column.key + '_min']"
                  (input)="applyFilters()"
                  placeholder="Min"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
                <input
                  type="number"
                  [(ngModel)]="columnFilters[column.key + '_max']"
                  (input)="applyFilters()"
                  placeholder="Max"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
              </div>
              
              <!-- Filtro de fecha -->
              <div *ngIf="getFilterType(column) === 'date'" class="flex space-x-2">
                <input
                  type="date"
                  [(ngModel)]="columnFilters[column.key + '_from']"
                  (change)="applyFilters()"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
                <input
                  type="date"
                  [(ngModel)]="columnFilters[column.key + '_to']"
                  (change)="applyFilters()"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selección múltiple y info -->
      <div *ngIf="selectable || filteredData.length > 0" class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Checkbox select all -->
          <label *ngIf="selectable" class="flex items-center">
            <input
              type="checkbox"
              [checked]="isAllSelected()"
              [indeterminate]="isSomeSelected()"
              (change)="toggleSelectAll()"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            <span class="ml-2 text-sm text-gray-700">
              {{ selectedRows.length > 0 ? selectedRows.length + ' seleccionados' : 'Seleccionar todo' }}
            </span>
          </label>
          
          <!-- Acciones de selección múltiple -->
          <div *ngIf="selectedRows.length > 0 && bulkActions.length > 0" class="flex items-center space-x-2">
            <button
              *ngFor="let action of bulkActions"
              (click)="executeBulkAction(action)"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              [class]="action.class || 'bg-blue-100 text-blue-700 hover:bg-blue-200'">
              <i [class]="action.icon" class="mr-1"></i>
              {{ action.label }}
            </button>
          </div>
        </div>
        
        <!-- Info de resultados -->
        <div class="text-sm text-gray-600">
          Mostrando {{ getPaginationInfo() }}
        </div>
      </div>

      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <!-- Checkbox column -->
              <th *ngIf="selectable" class="px-6 py-3 w-12">
                <!-- Checkbox header space -->
              </th>
              
              <th
                *ngFor="let column of columns"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                [class.cursor-pointer]="column.sortable"
                [style.width]="column.width"
                (click)="column.sortable && onSort(column)">
                <div class="flex items-center space-x-1">
                  <span>{{ column.label }}</span>
                  <span *ngIf="column.sortable" class="flex flex-col">
                    <i class="fas fa-caret-up text-xs" 
                       [class.text-blue-600]="sortColumn === column.key && sortDirection === 'asc'"
                       [class.text-gray-300]="!(sortColumn === column.key && sortDirection === 'asc')"></i>
                    <i class="fas fa-caret-down text-xs -mt-1" 
                       [class.text-blue-600]="sortColumn === column.key && sortDirection === 'desc'"
                       [class.text-gray-300]="!(sortColumn === column.key && sortDirection === 'desc')"></i>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading state -->
            <tr *ngIf="loading">
              <td [attr.colspan]="getTotalColumns()" class="px-6 py-12 text-center">
                <div class="flex items-center justify-center">
                  <app-loading-spinner type="circular" [size]="32"></app-loading-spinner>
                  <span class="ml-3 text-gray-600">{{ loadingText || 'Cargando datos...' }}</span>
                </div>
              </td>
            </tr>
            
            <!-- Empty state -->
            <tr *ngIf="!loading && paginatedData.length === 0">
              <td [attr.colspan]="getTotalColumns()" class="px-6 py-12 text-center">
                <div class="text-gray-500">
                  <i class="fas fa-inbox text-4xl mb-4 block text-gray-300"></i>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No hay datos</h3>
                  <p>{{ emptyMessage || 'No se encontraron registros que coincidan con los filtros aplicados.' }}</p>
                </div>
              </td>
            </tr>
            
            <!-- Data rows -->
            <tr
              *ngFor="let row of paginatedData; let i = index"
              class="hover:bg-gray-50 transition-colors cursor-pointer"
              [class.bg-blue-50]="isRowSelected(row)"
              (click)="onRowClick(row, $event)">
              
              <!-- Checkbox cell -->
              <td *ngIf="selectable" class="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  [checked]="isRowSelected(row)"
                  (click)="$event.stopPropagation()"
                  (change)="toggleRowSelection(row)"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              </td>
              
              <!-- Data cells -->
              <td
                *ngFor="let column of columns"
                class="px-6 py-4 whitespace-nowrap text-sm"
                [class.font-medium]="column.key === 'name' || column.key === 'title'"
                [class.text-gray-900]="column.key === 'name' || column.key === 'title'"
                [class.text-gray-500]="!(column.key === 'name' || column.key === 'title')">
                
                <ng-container [ngSwitch]="column.type">
                  <!-- Badge -->
                  <span *ngSwitchCase="'badge'" 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [style.background-color]="getBadgeColor(column, getCellValue(row, column))"
                        [style.color]="getBadgeTextColor(column, getCellValue(row, column))">
                    {{ getCellValue(row, column) }}
                  </span>
                  
                  <!-- Currency -->
                  <span *ngSwitchCase="'currency'">
                    {{ formatCurrency(getCellValue(row, column)) }}
                  </span>
                  
                  <!-- Date -->
                  <span *ngSwitchCase="'date'">
                    {{ formatDate(getCellValue(row, column)) }}
                  </span>
                  
                  <!-- Number -->
                  <span *ngSwitchCase="'number'">
                    {{ formatNumber(getCellValue(row, column)) }}
                  </span>
                  
                  <!-- Boolean -->
                  <span *ngSwitchCase="'boolean'">
                    <i class="fas"
                       [class.fa-check-circle]="getCellValue(row, column)"
                       [class.fa-times-circle]="!getCellValue(row, column)"
                       [class.text-green-500]="getCellValue(row, column)"
                       [class.text-red-500]="!getCellValue(row, column)"></i>
                  </span>
                  
                  <!-- Actions -->
                  <div *ngSwitchCase="'actions'" class="flex items-center space-x-2">
                    <ng-content select="[slot=actions]"></ng-content>
                  </div>
                  
                  <!-- Default text -->
                  <span *ngSwitchDefault>
                    {{ column.format ? column.format(getCellValue(row, column)) : getCellValue(row, column) }}
                  </span>
                </ng-container>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div *ngIf="showPagination && totalPages > 1" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Página {{ currentPage }} de {{ totalPages }} ({{ filteredData.length }} registros)
          </div>
          
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <!-- Previous -->
            <button
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <!-- Page numbers -->
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium transition-colors"
              [class.bg-blue-50]="page === currentPage"
              [class.text-blue-600]="page === currentPage"
              [class.border-blue-500]="page === currentPage"
              [class.bg-white]="page !== currentPage"
              [class.text-gray-700]="page !== currentPage"
              [class.hover:bg-gray-50]="page !== currentPage">
              {{ page }}
            </button>
            
            <!-- Next -->
            <button
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./advanced-data-table.component.scss']
})
export class AdvancedDataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: AdvancedTableColumn[] = [];
  @Input() title?: string;
  @Input() pageSize: number = 10;
  @Input() showPagination: boolean = true;
  @Input() searchable: boolean = true;
  @Input() selectable: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingText?: string;
  @Input() emptyMessage?: string;
  @Input() bulkActions: any[] = [];
  @Input() exportOptions: ExportOptions = {};

  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() bulkActionExecute = new EventEmitter<{action: any, selectedRows: any[]}>();

  // Data states
  filteredData: any[] = [];
  paginatedData: any[] = [];
  selectedRows: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  
  // Search and filters
  globalSearchTerm: string = '';
  columnFilters: { [key: string]: any } = {};
  showAdvancedFilters: boolean = false;
  
  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  get filterableColumns(): AdvancedTableColumn[] {
    return this.columns.filter(col => col.filterable !== false && col.type !== 'actions');
  }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.filteredData = [...this.data];
    this.applyFilters();
  }

  // Búsqueda global
  onGlobalSearch(): void {
    this.applyFilters();
  }

  // Filtros por columna
  applyFilters(): void {
    let filtered = [...this.data];

    // Filtro global
    if (this.globalSearchTerm) {
      const searchLower = this.globalSearchTerm.toLowerCase();
      filtered = filtered.filter(row => 
        this.columns.some(col => {
          const value = this.getCellValue(row, col);
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Filtros por columna
    Object.keys(this.columnFilters).forEach(key => {
      const filterValue = this.columnFilters[key];
      if (filterValue === null || filterValue === undefined || filterValue === '') return;

      if (key.endsWith('_min') || key.endsWith('_max')) {
        const columnKey = key.replace('_min', '').replace('_max', '');
        const isMin = key.endsWith('_min');
        
        filtered = filtered.filter(row => {
          const value = parseFloat(this.getCellValue(row, { key: columnKey } as AdvancedTableColumn));
          return isMin ? value >= filterValue : value <= filterValue;
        });
      } else if (key.endsWith('_from') || key.endsWith('_to')) {
        const columnKey = key.replace('_from', '').replace('_to', '');
        const isFrom = key.endsWith('_from');
        
        filtered = filtered.filter(row => {
          const value = new Date(this.getCellValue(row, { key: columnKey } as AdvancedTableColumn));
          const filterDate = new Date(filterValue);
          return isFrom ? value >= filterDate : value <= filterDate;
        });
      } else {
        filtered = filtered.filter(row => {
          const value = this.getCellValue(row, { key } as AdvancedTableColumn);
          return value && value.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
        });
      }
    });

    this.filteredData = filtered;
    this.updatePagination();
  }

  // Sorting
  onSort(column: AdvancedTableColumn): void {
    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aVal = this.getCellValue(a, column);
      const bVal = this.getCellValue(b, column);
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.updatePagination();
  }

  // Paginación
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1) this.currentPage = 1;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Selección múltiple
  toggleRowSelection(row: any): void {
    const index = this.selectedRows.findIndex(r => this.getRowId(r) === this.getRowId(row));
    if (index >= 0) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }
    this.selectionChange.emit(this.selectedRows);
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedRows = [];
    } else {
      this.selectedRows = [...this.paginatedData];
    }
    this.selectionChange.emit(this.selectedRows);
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.some(r => this.getRowId(r) === this.getRowId(row));
  }

  isAllSelected(): boolean {
    return this.paginatedData.length > 0 && 
           this.paginatedData.every(row => this.isRowSelected(row));
  }

  isSomeSelected(): boolean {
    return this.selectedRows.length > 0 && !this.isAllSelected();
  }

  private getRowId(row: any): any {
    return row.id || row._id || JSON.stringify(row);
  }

  // Acciones masivas
  executeBulkAction(action: any): void {
    this.bulkActionExecute.emit({ action, selectedRows: this.selectedRows });
  }

  // Exportación
  exportToExcel(): void {
    const exportData = this.prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    
    const filename = this.exportOptions.filename || 'datos.xlsx';
    XLSX.writeFile(workbook, filename);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const exportData = this.prepareExportData();
    
    // Título
    const title = this.exportOptions.title || this.title || 'Datos';
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    
    // Fecha si se requiere
    if (this.exportOptions.includeDate !== false) {
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30);
    }

    // Tabla
    const headers = this.getExportableColumns().map(col => col.label);
    const rows = exportData.map(row => Object.values(row).map(val => String(val || '')));

    autoTable(doc, {
      head: [headers],
      body: rows as any,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    const filename = this.exportOptions.filename?.replace('.xlsx', '.pdf') || 'datos.pdf';
    doc.save(filename);
  }

  private prepareExportData(): any[] {
    const dataToExport = this.exportOptions.selectedOnly ? this.selectedRows : this.filteredData;
    const exportableColumns = this.getExportableColumns();
    
    return dataToExport.map(row => {
      const exportRow: any = {};
      exportableColumns.forEach(col => {
        exportRow[col.label] = this.getCellValue(row, col);
      });
      return exportRow;
    });
  }

  private getExportableColumns(): AdvancedTableColumn[] {
    return this.columns.filter(col => col.exportable !== false && col.type !== 'actions');
  }

  // Utilidades
  getCellValue(row: any, column: AdvancedTableColumn): any {
    return row[column.key];
  }

  getBadgeColor(column: AdvancedTableColumn, value: any): string {
    return column.badgeColors?.[value] || '#E5E7EB';
  }

  getBadgeTextColor(column: AdvancedTableColumn, value: any): string {
    // Simple logic to determine text color based on background
    const bgColor = this.getBadgeColor(column, value);
    return bgColor === '#E5E7EB' ? '#374151' : '#FFFFFF';
  }

  formatCurrency(value: any): string {
    return new Intl.NumberFormat('es-BO', { 
      style: 'currency', 
      currency: 'BOB' 
    }).format(value || 0);
  }

  formatDate(value: any): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('es-BO');
  }

  formatNumber(value: any): string {
    return new Intl.NumberFormat('es-BO').format(value || 0);
  }

  getFilterType(column: AdvancedTableColumn): string {
    if (column.type === 'number' || column.type === 'currency') return 'number';
    if (column.type === 'date') return 'date';
    
    // Si hay pocos valores únicos, usar select
    const uniqueValues = this.getUniqueValues(column.key);
    if (uniqueValues.length <= 10) return 'select';
    
    return 'text';
  }

  getUniqueValues(columnKey: string): any[] {
    const values = this.data.map(row => row[columnKey]).filter(val => val !== null && val !== undefined);
    return [...new Set(values)].sort();
  }

  hasActiveFilters(): boolean {
    return this.globalSearchTerm.length > 0 || 
           Object.values(this.columnFilters).some(val => val !== null && val !== undefined && val !== '');
  }

  clearAllFilters(): void {
    this.globalSearchTerm = '';
    this.columnFilters = {};
    this.applyFilters();
  }

  onRowClick(row: any, event: Event): void {
    if (!this.selectable || !(event.target as HTMLElement).closest('input[type="checkbox"]')) {
      this.rowClick.emit(row);
    }
  }

  getTotalColumns(): number {
    return this.columns.length + (this.selectable ? 1 : 0);
  }

  getPaginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.filteredData.length);
    return `${start}-${end} de ${this.filteredData.length}`;
  }
}