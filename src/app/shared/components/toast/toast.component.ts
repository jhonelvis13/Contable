// src/app/shared/components/toast/toast.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastNotification } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() notification!: ToastNotification;
  @Output() dismiss = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<() => void>();

  progress = 100;
  private progressInterval?: any;

  ngOnInit(): void {
    if (this.notification.showProgress && this.notification.duration && this.notification.duration > 0) {
      this.startProgressBar();
    }
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  onDismiss(): void {
    this.dismiss.emit(this.notification.id);
  }

  onActionClick(action: any): void {
    action.handler();
    this.actionClick.emit(action.handler);
  }

  get toastClasses(): string {
    const baseClasses = 'toast-container';
    const typeClasses = {
      success: 'toast-success',
      error: 'toast-error',
      warning: 'toast-warning',
      info: 'toast-info'
    };
    
    return `${baseClasses} ${typeClasses[this.notification.type]}`;
  }

  get iconClass(): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    
    return icons[this.notification.type];
  }

  private startProgressBar(): void {
    if (!this.notification.duration) return;
    
    const updateInterval = 50; // Actualizar cada 50ms
    const totalSteps = this.notification.duration / updateInterval;
    const progressStep = 100 / totalSteps;

    this.progressInterval = setInterval(() => {
      this.progress -= progressStep;
      
      if (this.progress <= 0) {
        this.progress = 0;
        clearInterval(this.progressInterval);
      }
    }, updateInterval);
  }
}