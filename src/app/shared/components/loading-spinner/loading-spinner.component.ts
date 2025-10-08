import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-spinner-container" [class]="containerClass" [attr.aria-label]="ariaLabel">
      <!-- Spinner circular -->
      <div *ngIf="type === 'circular'" class="spinner spinner-circular" [class]="spinnerClass">
        <svg viewBox="0 0 50 50" [style.width.px]="size" [style.height.px]="size">
          <circle 
            cx="25" 
            cy="25" 
            r="20" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="31.416"
            stroke-dashoffset="31.416"
            class="spinner-path"
          />
        </svg>
      </div>

      <!-- Spinner de puntos -->
      <div *ngIf="type === 'dots'" class="spinner spinner-dots" [class]="spinnerClass">
        <div class="dot" *ngFor="let dot of [1,2,3]"></div>
      </div>

      <!-- Spinner de barras -->
      <div *ngIf="type === 'bars'" class="spinner spinner-bars" [class]="spinnerClass">
        <div class="bar" *ngFor="let bar of [1,2,3,4,5]"></div>
      </div>

      <!-- Spinner de pulso -->
      <div *ngIf="type === 'pulse'" class="spinner spinner-pulse" [class]="spinnerClass">
        <div class="pulse-circle"></div>
      </div>

      <!-- Mensaje de carga -->
      <div *ngIf="message" class="loading-message" [class]="messageClass">
        {{ message }}
      </div>

      <!-- Progreso (solo si se proporciona) -->
      <div *ngIf="showProgress && progress !== undefined" class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            [style.width.%]="progress"
            [class]="progressClass"
          ></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() type: 'circular' | 'dots' | 'bars' | 'pulse' = 'circular';
  @Input() size: number = 40;
  @Input() message: string = '';
  @Input() progress: number | undefined = undefined;
  @Input() showProgress: boolean = false;
  
  // Clases CSS personalizables
  @Input() containerClass: string = '';
  @Input() spinnerClass: string = '';
  @Input() messageClass: string = '';
  @Input() progressClass: string = '';
  
  // Colores predefinidos
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
  
  get ariaLabel(): string {
    return this.message || 'Cargando contenido...';
  }

  constructor() {}

  ngOnInit(): void {
    // Aplicar clase de color si no se proporciona clase personalizada
    if (!this.spinnerClass) {
      this.spinnerClass = `spinner-${this.color}`;
    }
    
    if (!this.progressClass) {
      this.progressClass = `progress-${this.color}`;
    }
  }
}
