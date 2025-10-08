import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'currency' | 'badge' | 'actions';
  badgeColors?: { [key: string]: string };
}

export interface TableAction {
  icon: string;
  label: string;
  color: string;
  handler: (item: any) => void;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() pageSize: number = 10;
  @Input() showPagination: boolean = true;
  @Input() searchable: boolean = true;
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();

  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  ngOnChanges(): void {
    this.filteredData = [...this.data];
    this.applyFilters();
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.data];

    // Apply search
    if (this.searchTerm) {
      result = result.filter(item => {
        return this.columns.some(col => {
          const value = item[col.key]?.toString().toLowerCase() || '';
          return value.includes(this.searchTerm);
        });
      });
    }

    // Apply sorting
    if (this.sortColumn) {
      result.sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];

        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredData = result;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onActionClick(action: string, row: any, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ action, row });
  }

  get pages(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
  }
}