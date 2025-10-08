// src/app/core/services/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  isLoading: boolean;
  loadingType: 'skeleton' | 'spinner' | 'progress' | 'overlay';
  loadingMessage?: string;
  progress?: number; // 0-100 para barras de progreso
  context?: string; // Identificador único para múltiples cargas
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStates = new Map<string, LoadingState>();
  private loadingSubject = new BehaviorSubject<Map<string, LoadingState>>(new Map());
  
  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  /**
   * Iniciar estado de carga
   */
  startLoading(
    context: string = 'default',
    type: LoadingState['loadingType'] = 'skeleton',
    message?: string
  ): void {
    const loadingState: LoadingState = {
      isLoading: true,
      loadingType: type,
      loadingMessage: message,
      context,
      progress: type === 'progress' ? 0 : undefined
    };

    this.loadingStates.set(context, loadingState);
    this.loadingSubject.next(new Map(this.loadingStates));
  }

  /**
   * Actualizar progreso (solo para tipo 'progress')
   */
  updateProgress(context: string = 'default', progress: number, message?: string): void {
    const currentState = this.loadingStates.get(context);
    if (currentState && currentState.loadingType === 'progress') {
      const updatedState: LoadingState = {
        ...currentState,
        progress: Math.min(100, Math.max(0, progress)),
        loadingMessage: message || currentState.loadingMessage
      };

      this.loadingStates.set(context, updatedState);
      this.loadingSubject.next(new Map(this.loadingStates));
    }
  }

  /**
   * Actualizar mensaje de carga
   */
  updateMessage(context: string = 'default', message: string): void {
    const currentState = this.loadingStates.get(context);
    if (currentState) {
      const updatedState: LoadingState = {
        ...currentState,
        loadingMessage: message
      };

      this.loadingStates.set(context, updatedState);
      this.loadingSubject.next(new Map(this.loadingStates));
    }
  }

  /**
   * Detener estado de carga
   */
  stopLoading(context: string = 'default'): void {
    this.loadingStates.delete(context);
    this.loadingSubject.next(new Map(this.loadingStates));
  }

  /**
   * Detener todas las cargas
   */
  stopAllLoading(): void {
    this.loadingStates.clear();
    this.loadingSubject.next(new Map());
  }

  /**
   * Verificar si está cargando un contexto específico
   */
  isLoading(context: string = 'default'): Observable<boolean> {
    return new Observable(observer => {
      this.loading$.subscribe(states => {
        const state = states.get(context);
        observer.next(state?.isLoading ?? false);
      });
    });
  }

  /**
   * Obtener estado de carga específico
   */
  getLoadingState(context: string = 'default'): Observable<LoadingState | null> {
    return new Observable(observer => {
      this.loading$.subscribe(states => {
        observer.next(states.get(context) || null);
      });
    });
  }

  /**
   * Métodos de conveniencia para diferentes tipos de carga
   */

  // Para cargas de datos (skeleton)
  startDataLoading(context: string = 'data', message: string = 'Cargando datos...'): void {
    this.startLoading(context, 'skeleton', message);
  }

  // Para operaciones rápidas (spinner)
  startOperationLoading(context: string = 'operation', message: string = 'Procesando...'): void {
    this.startLoading(context, 'spinner', message);
  }

  // Para cargas con progreso
  startProgressLoading(context: string = 'upload', message: string = 'Subiendo archivo...'): void {
    this.startLoading(context, 'progress', message);
  }

  // Para overlay que bloquea toda la pantalla
  startOverlayLoading(message: string = 'Guardando cambios...'): void {
    this.startLoading('overlay', 'overlay', message);
  }

  // Simulador de progreso automático
  simulateProgress(
    context: string = 'default',
    duration: number = 3000,
    onComplete?: () => void
  ): void {
    this.startProgressLoading(context, 'Procesando...');
    
    let progress = 0;
    const interval = 50; // Actualizar cada 50ms
    const increment = (100 * interval) / duration;

    const progressInterval = setInterval(() => {
      progress += increment;
      
      if (progress >= 100) {
        this.updateProgress(context, 100, 'Completado');
        setTimeout(() => {
          this.stopLoading(context);
          if (onComplete) onComplete();
        }, 500);
        clearInterval(progressInterval);
      } else {
        this.updateProgress(context, progress, `Procesando... ${Math.round(progress)}%`);
      }
    }, interval);
  }

  // Wrapper para ejecutar operación con loading automático
  async executeWithLoading<T>(
    operation: () => Promise<T>,
    context: string = 'default',
    type: LoadingState['loadingType'] = 'skeleton',
    message?: string
  ): Promise<T> {
    try {
      this.startLoading(context, type, message);
      const result = await operation();
      this.stopLoading(context);
      return result;
    } catch (error) {
      this.stopLoading(context);
      throw error;
    }
  }
}