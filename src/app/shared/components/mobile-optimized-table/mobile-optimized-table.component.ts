import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface MobileTableConfig {
  compactMode: boolean;
  showAvatars: boolean;
  cardView: boolean;
  swipeActions: boolean;
  infiniteScroll: boolean;
  pullToRefresh: boolean;
  stickyHeader: boolean;
  quickActions: boolean;
}

export interface SwipeAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  backgroundColor: string;
  action: (item: any) => void;
}

@Component({
  selector: 'app-mobile-optimized-table',
  template: `
    <div class="mobile-optimized-table" [class.card-view]="config.cardView">
      <!-- Mobile Header -->
      <div class="mobile-header" [class.header-sticky]="config.stickyHeader">
        <div class="flex items-center justify-between p-4 bg-white border-b">
          <div class="flex items-center space-x-3">
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <i class="fas fa-bars text-gray-600"></i>
            </button>
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
            <span *ngIf="totalItems" class="text-sm text-gray-500">({{ totalItems }})</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- View Toggle -->
            <button
              (click)="toggleCardView()"
              [class]="config.cardView ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
              class="p-2 rounded-lg transition-colors">
              <i [class]="config.cardView ? 'fas fa-th-large' : 'fas fa-list'"></i>
            </button>
            
            <!-- Settings -->
            <button
              (click)="showMobileSettings = !showMobileSettings"
              class="p-2 rounded-lg hover:bg-gray-100">
              <i class="fas fa-cog text-gray-600"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Search -->
        <div class="p-4 bg-gray-50 border-b">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch($event)"
              placeholder="Buscar..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <button
              *ngIf="searchTerm"
              (click)="clearSearch()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Quick Filters -->
        <div *ngIf="quickFilters.length > 0" class="p-2 bg-white border-b">
          <div class="flex space-x-2 overflow-x-auto pb-2">
            <button
              *ngFor="let filter of quickFilters"
              (click)="applyQuickFilter(filter)"
              [class]="filter.active ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'"
              class="px-3 py-1 rounded-full text-sm border whitespace-nowrap">
              {{ filter.label }}
              <span *ngIf="filter.count" class="ml-1 text-xs">{{ filter.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pull to Refresh -->
      <div 
        *ngIf="config.pullToRefresh"
        class="pull-to-refresh"
        [class.refreshing]="isRefreshing"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd($event)">
        <div class="refresh-indicator">
          <i class="fas fa-sync-alt" [class.animate-spin]="isRefreshing"></i>
          <span class="ml-2 text-sm text-gray-600">
            {{ isRefreshing ? 'Actualizando...' : 'Desliza para actualizar' }}
          </span>
        </div>
      </div>

      <!-- Mobile Content -->
      <div class="mobile-content" #scrollContainer>
        <!-- Card View -->
        <div *ngIf="config.cardView" class="card-container p-4 space-y-4">
          <div
            *ngFor="let item of items; trackBy: trackByFn"
            class="mobile-card bg-white rounded-lg shadow-sm border p-4"
            [class.compact]="config.compactMode"
            (click)="onItemClick(item)"
            (touchstart)="onCardTouchStart($event, item)"
            (touchmove)="onCardTouchMove($event)"
            (touchend)="onCardTouchEnd($event, item)">
            
            <!-- Card Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div *ngIf="config.showAvatars" class="avatar">
                  <img *ngIf="getItemAvatar(item)" 
                       [src]="getItemAvatar(item)" 
                       [alt]="getItemTitle(item)"
                       class="w-10 h-10 rounded-full">
                  <div *ngIf="!getItemAvatar(item)" 
                       class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600">
                      {{ getItemInitials(item) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ getItemTitle(item) }}
                  </h3>
                  <p *ngIf="getItemSubtitle(item)" class="text-xs text-gray-500 truncate">
                    {{ getItemSubtitle(item) }}
                  </p>
                </div>
              </div>
              
              <!-- Status Badge -->
              <div *ngIf="getItemStatus(item)" 
                   [ngClass]="getStatusClasses(item)"
                   class="px-2 py-1 rounded-full text-xs font-medium">
                {{ getItemStatus(item) }}
              </div>
            </div>

            <!-- Card Content -->
            <div class="space-y-2">
              <div 
                *ngFor="let field of visibleFields" 
                class="flex justify-between items-center"
                [class.hidden]="config.compactMode && !field.essential">
                <span class="text-xs text-gray-500">{{ field.label }}:</span>
                <span class="text-sm text-gray-900 font-medium">
                  {{ formatFieldValue(item[field.key], field.type) }}
                </span>
              </div>
            </div>

            <!-- Card Actions -->
            <div *ngIf="config.quickActions" class="flex justify-end space-x-2 mt-3 pt-3 border-t">
              <button
                *ngFor="let action of getItemActions(item)"
                (click)="executeAction(action, item, $event)"
                [style.color]="action.color"
                class="p-1 rounded hover:bg-gray-100 transition-colors">
                <i [class]="action.icon" class="text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div *ngIf="!config.cardView" class="list-container">
          <div
            *ngFor="let item of items; trackBy: trackByFn"
            class="mobile-list-item bg-white border-b p-4 flex items-center justify-between"
            [class.compact]="config.compactMode"
            (click)="onItemClick(item)"
            (touchstart)="onListTouchStart($event, item)"
            (touchmove)="onListTouchMove($event)"
            (touchend)="onListTouchEnd($event, item)">
            
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <div *ngIf="config.showAvatars" class="avatar">
                <img *ngIf="getItemAvatar(item)" 
                     [src]="getItemAvatar(item)" 
                     [alt]="getItemTitle(item)"
                     class="w-8 h-8 rounded-full">
                <div *ngIf="!getItemAvatar(item)" 
                     class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-xs font-medium text-gray-600">
                    {{ getItemInitials(item) }}
                  </span>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ getItemTitle(item) }}
                </h3>
                <p class="text-xs text-gray-500 truncate">
                  {{ getItemSubtitle(item) }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <!-- Status -->
              <div *ngIf="getItemStatus(item)" 
                   [ngClass]="getStatusClasses(item)"
                   class="px-2 py-1 rounded-full text-xs font-medium">
                {{ getItemStatus(item) }}
              </div>
              
              <!-- Chevron -->
              <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="items.length === 0 && !loading" class="empty-state p-8 text-center">
          <i class="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ emptyTitle || 'No hay elementos' }}</h3>
          <p class="text-gray-500">{{ emptyMessage || 'No se encontraron elementos que coincidan con los filtros aplicados.' }}</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-state p-8">
          <div class="flex items-center justify-center">
            <i class="fas fa-spinner animate-spin text-2xl text-blue-600 mr-3"></i>
            <span class="text-gray-600">Cargando...</span>
          </div>
        </div>

        <!-- Infinite Scroll Loading -->
        <div *ngIf="config.infiniteScroll && hasMore && !loading" 
             class="infinite-scroll-trigger"
             #infiniteScrollTrigger>
          <div class="p-4 text-center">
            <button 
              (click)="loadMore()"
              class="text-blue-600 hover:text-blue-800 text-sm">
              Cargar más elementos
            </button>
          </div>
        </div>
      </div>

      <!-- Swipe Actions Overlay -->
      <div *ngIf="swipeActionVisible" 
           class="swipe-actions-overlay fixed inset-0 bg-black bg-opacity-50 z-50"
           (click)="hideSwipeActions()">
        <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4">
          <div class="flex justify-center mb-4">
            <div class="w-8 h-1 bg-gray-300 rounded"></div>
          </div>
          <div class="space-y-2">
            <button
              *ngFor="let action of currentSwipeActions"
              (click)="executeSwipeAction(action)"
              class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div [style.background-color]="action.backgroundColor" 
                   class="w-10 h-10 rounded-full flex items-center justify-center">
                <i [class]="action.icon" [style.color]="action.color"></i>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ action.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Settings Panel -->
      <div *ngIf="showMobileSettings" 
           class="mobile-settings-overlay fixed inset-0 bg-black bg-opacity-50 z-50"
           (click)="showMobileSettings = false">
        <div class="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg"
             (click)="$event.stopPropagation()">
          <div class="p-4 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Configuración</h3>
              <button (click)="showMobileSettings = false">
                <i class="fas fa-times text-gray-400"></i>
              </button>
            </div>
          </div>
          
          <div class="p-4 space-y-4">
            <!-- Display Options -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Vista</h4>
              <div class="space-y-2">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Modo compacto</span>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="config.compactMode"
                    (change)="onConfigChange()"
                    class="rounded">
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Mostrar avatares</span>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="config.showAvatars"
                    (change)="onConfigChange()"
                    class="rounded">
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Acciones rápidas</span>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="config.quickActions"
                    (change)="onConfigChange()"
                    class="rounded">
                </label>
              </div>
            </div>

            <!-- Interaction Options -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Interacción</h4>
              <div class="space-y-2">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Acciones deslizando</span>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="config.swipeActions"
                    (change)="onConfigChange()"
                    class="rounded">
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Scroll infinito</span>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="config.infiniteScroll"
                    (change)="onConfigChange()"
                    class="rounded">
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Deslizar para actualizar</span>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="config.pullToRefresh"
                    (change)="onConfigChange()"
                    class="rounded">
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-optimized-table {
      @apply relative;
    }
    
    .mobile-header.header-sticky {
      @apply sticky top-0 z-40;
    }
    
    .mobile-card {
      @apply transition-transform duration-200;
    }
    
    .mobile-card:active {
      @apply transform scale-95;
    }
    
    .mobile-card.compact {
      @apply p-3;
    }
    
    .mobile-list-item.compact {
      @apply py-2;
    }
    
    .pull-to-refresh {
      @apply flex items-center justify-center p-4 bg-gray-50;
      transition: transform 0.3s ease;
    }
    
    .pull-to-refresh.refreshing {
      @apply bg-blue-50;
    }
    
    .swipe-actions-overlay {
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
    
    .mobile-settings-overlay {
      animation: slideLeft 0.3s ease-out;
    }
    
    @keyframes slideLeft {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
    
    @media (min-width: 768px) {
      .mobile-optimized-table {
        @apply hidden;
      }
    }
  `]
})
export class MobileOptimizedTableComponent implements OnInit, OnDestroy {
  @Input() items: any[] = [];
  @Input() loading = false;
  @Input() title = '';
  @Input() totalItems?: number;
  @Input() visibleFields: any[] = [];
  @Input() quickFilters: any[] = [];
  @Input() emptyTitle?: string;
  @Input() emptyMessage?: string;
  @Input() hasMore = false;
  @Input() trackByFn: any = (index: number) => index;

  @Input() config: MobileTableConfig = {
    compactMode: false,
    showAvatars: true,
    cardView: true,
    swipeActions: true,
    infiniteScroll: true,
    pullToRefresh: true,
    stickyHeader: true,
    quickActions: true
  };

  @Output() itemClick = new EventEmitter<any>();
  @Output() actionExecute = new EventEmitter<{ action: string, item: any }>();
  @Output() loadMoreItems = new EventEmitter<void>();
  @Output() refreshData = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() quickFilterChange = new EventEmitter<any>();
  @Output() configChange = new EventEmitter<MobileTableConfig>();

  searchTerm = '';
  showMobileSettings = false;
  swipeActionVisible = false;
  currentSwipeActions: SwipeAction[] = [];
  currentSwipeItem: any = null;
  isRefreshing = false;

  // Touch handling
  private touchStartY = 0;
  private touchStartX = 0;
  private swipeThreshold = 50;
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    // Setup intersection observer for infinite scroll
    if (this.config.infiniteScroll) {
      this.setupInfiniteScroll();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupInfiniteScroll(): void {
    // Implementation would use Intersection Observer API
    // This is a simplified version
  }

  // Touch Event Handlers
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.config.pullToRefresh) return;
    
    const currentY = event.touches[0].clientY;
    const diff = currentY - this.touchStartY;
    
    if (diff > 0 && window.scrollY === 0) {
      event.preventDefault();
      // Show pull indicator
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.config.pullToRefresh) return;
    
    const endY = event.changedTouches[0].clientY;
    const diff = endY - this.touchStartY;
    
    if (diff > this.swipeThreshold && window.scrollY === 0) {
      this.triggerRefresh();
    }
  }

  // Card Touch Events
  onCardTouchStart(event: TouchEvent, item: any): void {
    this.touchStartX = event.touches[0].clientX;
    this.currentSwipeItem = item;
  }

  onCardTouchMove(event: TouchEvent): void {
    // Handle swipe gesture
  }

  onCardTouchEnd(event: TouchEvent, item: any): void {
    if (!this.config.swipeActions) return;
    
    const endX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - endX;
    
    if (Math.abs(diff) > this.swipeThreshold) {
      this.showSwipeActions(item);
    }
  }

  // List Touch Events
  onListTouchStart(event: TouchEvent, item: any): void {
    this.onCardTouchStart(event, item);
  }

  onListTouchMove(event: TouchEvent): void {
    this.onCardTouchMove(event);
  }

  onListTouchEnd(event: TouchEvent, item: any): void {
    this.onCardTouchEnd(event, item);
  }

  // UI Actions
  toggleCardView(): void {
    this.config.cardView = !this.config.cardView;
    this.onConfigChange();
  }

  toggleMobileMenu(): void {
    // Implement mobile menu toggle
  }

  onSearch(event: any): void {
    this.searchChange.emit(event.target.value);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  applyQuickFilter(filter: any): void {
    filter.active = !filter.active;
    this.quickFilterChange.emit(filter);
  }

  onItemClick(item: any): void {
    this.itemClick.emit(item);
  }

  executeAction(action: any, item: any, event: Event): void {
    event.stopPropagation();
    this.actionExecute.emit({ action: action.id, item });
  }

  loadMore(): void {
    this.loadMoreItems.emit();
  }

  triggerRefresh(): void {
    this.isRefreshing = true;
    this.refreshData.emit();
    
    // Reset refresh state after delay
    setTimeout(() => {
      this.isRefreshing = false;
    }, 2000);
  }

  showSwipeActions(item: any): void {
    this.currentSwipeItem = item;
    this.currentSwipeActions = this.getSwipeActions(item);
    this.swipeActionVisible = true;
  }

  hideSwipeActions(): void {
    this.swipeActionVisible = false;
    this.currentSwipeItem = null;
    this.currentSwipeActions = [];
  }

  executeSwipeAction(action: SwipeAction): void {
    if (this.currentSwipeItem) {
      action.action(this.currentSwipeItem);
    }
    this.hideSwipeActions();
  }

  onConfigChange(): void {
    this.configChange.emit({ ...this.config });
  }

  // Data Methods
  getItemTitle(item: any): string {
    return item.name || item.nombre || item.title || item.id || 'Sin título';
  }

  getItemSubtitle(item: any): string {
    return item.subtitle || item.descripcion || item.email || '';
  }

  getItemAvatar(item: any): string {
    return item.avatar || item.photo || item.imagen;
  }

  getItemInitials(item: any): string {
    const title = this.getItemTitle(item);
    return title.split(' ').map(word => word.charAt(0)).join('').substr(0, 2).toUpperCase();
  }

  getItemStatus(item: any): string {
    return item.status || item.estado || item.state;
  }

  getStatusClasses(item: any): string {
    const status = this.getItemStatus(item);
    // Return appropriate CSS classes based on status
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getItemActions(item: any): any[] {
    // Return appropriate actions based on item type
    return [
      { id: 'view', icon: 'fas fa-eye', color: '#3B82F6' },
      { id: 'edit', icon: 'fas fa-edit', color: '#F59E0B' },
      { id: 'delete', icon: 'fas fa-trash', color: '#EF4444' }
    ];
  }

  getSwipeActions(item: any): SwipeAction[] {
    // Return swipe actions based on item
    return [
      {
        id: 'edit',
        label: 'Editar',
        icon: 'fas fa-edit',
        color: '#FFFFFF',
        backgroundColor: '#F59E0B',
        action: (item) => this.executeAction({ id: 'edit' }, item, new Event('click'))
      },
      {
        id: 'delete',
        label: 'Eliminar',
        icon: 'fas fa-trash',
        color: '#FFFFFF',
        backgroundColor: '#EF4444',
        action: (item) => this.executeAction({ id: 'delete' }, item, new Event('click'))
      }
    ];
  }

  formatFieldValue(value: any, type: string): string {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('es-BO', { 
          style: 'currency', 
          currency: 'BOB' 
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString('es-BO');
      case 'number':
        return new Intl.NumberFormat('es-BO').format(value);
      default:
        return value.toString();
    }
  }
}