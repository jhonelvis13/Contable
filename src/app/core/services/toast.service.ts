// src/app/core/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // en milisegundos, 0 = no auto-dismiss
  actions?: ToastAction[];
  showProgress?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export interface ToastAction {
  label: string;
  handler: () => void;
  style?: 'primary' | 'secondary' | 'link';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastNotification[]>([]);
  public toasts$: Observable<ToastNotification[]> = this.toastsSubject.asObservable();

  private defaultDuration = 5000; // 5 segundos
  private maxToasts = 5; // máximo de toasts visibles simultáneamente

  constructor() {}

  /**
   * Mostrar toast de éxito
   */
  success(title: string, message: string, options?: Partial<ToastNotification>): string {
    return this.show({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  /**
   * Mostrar toast de error
   */
  error(title: string, message: string, options?: Partial<ToastNotification>): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration: 0, // Los errores no se auto-dismiss por defecto
      ...options
    });
  }

  /**
   * Mostrar toast de advertencia
   */
  warning(title: string, message: string, options?: Partial<ToastNotification>): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration: 7000, // Las advertencias duran más tiempo
      ...options
    });
  }

  /**
   * Mostrar toast de información
   */
  info(title: string, message: string, options?: Partial<ToastNotification>): string {
    return this.show({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  /**
   * Mostrar toast genérico
   */
  show(notification: Partial<ToastNotification>): string {
    const toast: ToastNotification = {
      id: this.generateId(),
      type: 'info',
      title: '',
      message: '',
      duration: this.defaultDuration,
      showProgress: true,
      position: 'top-right',
      ...notification
    };

    const currentToasts = this.toastsSubject.value;
    
    // Limitar el número máximo de toasts
    const newToasts = [...currentToasts, toast];
    if (newToasts.length > this.maxToasts) {
      newToasts.shift(); // Remover el toast más antiguo
    }

    this.toastsSubject.next(newToasts);

    // Auto-dismiss si duration > 0
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);
    }

    return toast.id;
  }

  /**
   * Dismissar un toast específico
   */
  dismiss(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  /**
   * Dismissar todos los toasts
   */
  dismissAll(): void {
    this.toastsSubject.next([]);
  }

  /**
   * Actualizar un toast existente
   */
  update(id: string, updates: Partial<ToastNotification>): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    );
    this.toastsSubject.next(updatedToasts);
  }

  /**
   * Métodos de conveniencia para operaciones comunes
   */
  
  // Para operaciones CRUD exitosas
  savedSuccessfully(entityName: string = 'registro'): string {
    return this.success(
      '¡Guardado exitoso!', 
      `El ${entityName} se ha guardado correctamente.`
    );
  }

  deletedSuccessfully(entityName: string = 'registro'): string {
    return this.success(
      '¡Eliminado exitoso!', 
      `El ${entityName} se ha eliminado correctamente.`
    );
  }

  // Para errores de validación
  validationError(message: string = 'Por favor, revise los campos marcados.'): string {
    return this.error(
      'Error de validación',
      message
    );
  }

  // Para errores de conexión
  connectionError(): string {
    return this.error(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifique su conexión a internet.',
      {
        actions: [
          {
            label: 'Reintentar',
            handler: () => window.location.reload(),
            style: 'primary'
          }
        ]
      }
    );
  }

  // Para acciones que requieren confirmación
  actionPending(message: string): string {
    return this.info(
      'Procesando...',
      message,
      {
        duration: 0,
        showProgress: true
      }
    );
  }

  private generateId(): string {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}