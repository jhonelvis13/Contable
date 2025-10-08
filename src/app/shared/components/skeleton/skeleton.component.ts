// src/app/shared/components/skeleton/skeleton.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <div class="skeleton-container" [attr.aria-label]="'Cargando contenido' + (label ? ': ' + label : '')">
      <!-- Skeleton para tablas -->
      <div *ngIf="type === 'table'" class="skeleton-table">
        <div class="skeleton-table-header">
          <div 
            *ngFor="let col of getArray(columns)" 
            class="skeleton-table-header-cell"
            [style.width]="getColumnWidth(col)"
          ></div>
        </div>
        <div 
          *ngFor="let row of getArray(rows)" 
          class="skeleton-table-row"
        >
          <div 
            *ngFor="let col of getArray(columns)" 
            class="skeleton-table-cell"
            [style.width]="getColumnWidth(col)"
          ></div>
        </div>
      </div>

      <!-- Skeleton para cards -->
      <div *ngIf="type === 'card'" class="skeleton-card">
        <div class="skeleton-card-header" *ngIf="showHeader">
          <div class="skeleton-avatar" *ngIf="showAvatar"></div>
          <div class="skeleton-card-header-content">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-subtitle" *ngIf="showSubtitle"></div>
          </div>
        </div>
        <div class="skeleton-card-content">
          <div 
            *ngFor="let line of getArray(lines)" 
            class="skeleton-line"
            [style.width]="getLineWidth(line)"
          ></div>
        </div>
        <div class="skeleton-card-actions" *ngIf="showActions">
          <div 
            *ngFor="let action of getArray(actions || 2)" 
            class="skeleton-button"
          ></div>
        </div>
      </div>

      <!-- Skeleton para lista -->
      <div *ngIf="type === 'list'" class="skeleton-list">
        <div 
          *ngFor="let item of getArray(items)" 
          class="skeleton-list-item"
        >
          <div class="skeleton-avatar" *ngIf="showAvatar"></div>
          <div class="skeleton-list-content">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-subtitle" *ngIf="showSubtitle"></div>
            <div class="skeleton-line skeleton-description" *ngIf="showDescription"></div>
          </div>
          <div class="skeleton-list-actions" *ngIf="showActions">
            <div class="skeleton-button-small"></div>
            <div class="skeleton-button-small"></div>
          </div>
        </div>
      </div>

      <!-- Skeleton para texto/párrafo -->
      <div *ngIf="type === 'text'" class="skeleton-text">
        <div 
          *ngFor="let line of getArray(lines)" 
          class="skeleton-line"
          [style.width]="getLineWidth(line)"
        ></div>
      </div>

      <!-- Skeleton personalizado -->
      <div *ngIf="type === 'custom'" class="skeleton-custom">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
  @Input() type: 'table' | 'card' | 'list' | 'text' | 'custom' = 'card';
  @Input() rows: number = 5;
  @Input() columns: number = 4;
  @Input() lines: number = 3;
  @Input() items: number = 5;
  @Input() actions: number = 2;
  @Input() label: string = '';
  
  // Opciones de visualización
  @Input() showHeader: boolean = true;
  @Input() showAvatar: boolean = false;
  @Input() showSubtitle: boolean = true;
  @Input() showDescription: boolean = false;
  @Input() showActions: boolean = false;
  
  // Personalización de anchos
  @Input() columnWidths: string[] = [];
  @Input() lineWidths: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  getArray(length: number): number[] {
    return Array.from({ length }, (_, i) => i);
  }

  getColumnWidth(index: number): string {
    if (this.columnWidths.length > index) {
      return this.columnWidths[index];
    }
    
    // Anchos por defecto variados para más realismo
    const defaultWidths = ['20%', '25%', '30%', '15%', '25%', '20%'];
    return defaultWidths[index % defaultWidths.length];
  }

  getLineWidth(index: number): string {
    if (this.lineWidths.length > index) {
      return this.lineWidths[index];
    }
    
    // Anchos variados para simular texto real
    const defaultWidths = ['100%', '85%', '92%', '78%', '95%', '88%'];
    return defaultWidths[index % defaultWidths.length];
  }
}