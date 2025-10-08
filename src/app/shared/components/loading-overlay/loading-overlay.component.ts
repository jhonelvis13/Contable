// src/app/shared/components/loading-overlay/loading-overlay.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div 
      *ngIf="show" 
      class="loading-overlay"
      [class.overlay-backdrop]="backdrop"
      [class.overlay-blur]="blur"
      [style.z-index]="zIndex"
      (click)="onOverlayClick($event)"
    >
      <!-- Contenido del overlay -->
      <div class="overlay-content" [class]="contentClass" (click)="$event.stopPropagation()">
        <!-- Spinner -->
        <app-loading-spinner
          [type]="spinnerType"
          [size]="spinnerSize"
          [message]="message"
          [progress]="progress"
          [showProgress]="showProgress"
          [color]="color"
        ></app-loading-spinner>
        
        <!-- Botón de cancelar (opcional) -->
        <button 
          *ngIf="showCancelButton" 
          class="cancel-button"
          (click)="onCancel()"
          [disabled]="cancelDisabled"
        >
          {{ cancelText }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() message: string = 'Cargando...';
  @Input() progress: number | undefined = undefined;
  @Input() showProgress: boolean = false;
  
  // Configuración del spinner
  @Input() spinnerType: 'circular' | 'dots' | 'bars' | 'pulse' = 'circular';
  @Input() spinnerSize: number = 50;
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
  
  // Configuración del overlay
  @Input() backdrop: boolean = true;
  @Input() blur: boolean = false;
  @Input() zIndex: number = 9999;
  @Input() contentClass: string = '';
  
  // Botón de cancelar
  @Input() showCancelButton: boolean = false;
  @Input() cancelText: string = 'Cancelar';
  @Input() cancelDisabled: boolean = false;
  @Input() allowBackdropCancel: boolean = false;
  
  // Eventos
  @Input() onCancel: () => void = () => {};
  @Input() onBackdropClick: () => void = () => {};

  constructor() {}

  ngOnInit(): void {}

  onOverlayClick(event: Event): void {
    if (this.allowBackdropCancel) {
      this.onBackdropClick();
    }
  }
}