import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  options?: { value: any; label: string }[];
  validators?: any[];
  colspan?: 1 | 2 | 3 | 4; // Para grid layout
  disabled: boolean;
  hint?: string;
}

@Component({
  selector: 'app-form-modal',
  template: `
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 z-50 overflow-y-auto modal-backdrop" *ngIf="isVisible">
      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ease-out" 
             (click)="onCancel()"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-4xl mx-auto transform transition-all duration-300 ease-out scale-100 opacity-100 modal-content bg-white shadow-2xl rounded-xl overflow-hidden">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 px-6 py-5">
            <div class="text-center">
              <h3 class="text-xl font-bold text-gray-800 flex items-center justify-center mb-2">
                <i [class]="headerIcon + ' mr-3 text-blue-600'" *ngIf="headerIcon"></i>
                {{ title }}
              </h3>
              <p class="text-sm text-gray-600" *ngIf="subtitle">{{ subtitle }}</p>
            </div>
            <button (click)="onCancel()" 
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-2 transition-all duration-200">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <!-- Body -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="px-6 py-4">
            
            <!-- Loading State -->
            <div *ngIf="isLoading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-3 text-gray-600">{{ loadingText || 'Procesando...' }}</span>
            </div>

            <!-- Form Fields -->
            <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div *ngFor="let field of fields" 
                   [class]="'col-span-' + (field.colspan || 1)">
                
                <!-- Text Input -->
                <div *ngIf="field.type === 'text' || field.type === 'email' || field.type === 'password'" 
                     class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                    <span class="text-red-500" *ngIf="isFieldRequired(field)">*</span>
                  </label>
                  <input 
                    [type]="field.type"
                    [formControlName]="field.name"
                    [placeholder]="field.placeholder || ''"
                    [disabled]="field.disabled"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    [class.border-red-500]="isFieldInvalid(field.name)">
                  <p *ngIf="field.hint" class="text-xs text-gray-500 mt-1">{{ field.hint }}</p>
                  <p *ngIf="isFieldInvalid(field.name)" class="text-xs text-red-500 mt-1">
                    {{ getFieldError(field.name) }}
                  </p>
                </div>

                <!-- Number Input -->
                <div *ngIf="field.type === 'number'" class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                    <span class="text-red-500" *ngIf="isFieldRequired(field)">*</span>
                  </label>
                  <input 
                    type="number"
                    [formControlName]="field.name"
                    [placeholder]="field.placeholder || ''"
                    [disabled]="field.disabled"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    [class.border-red-500]="isFieldInvalid(field.name)">
                  <p *ngIf="field.hint" class="text-xs text-gray-500 mt-1">{{ field.hint }}</p>
                  <p *ngIf="isFieldInvalid(field.name)" class="text-xs text-red-500 mt-1">
                    {{ getFieldError(field.name) }}
                  </p>
                </div>

                <!-- Date Input -->
                <div *ngIf="field.type === 'date'" class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                    <span class="text-red-500" *ngIf="isFieldRequired(field)">*</span>
                  </label>
                  <input 
                    type="date"
                    [formControlName]="field.name"
                    [disabled]="field.disabled"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    [class.border-red-500]="isFieldInvalid(field.name)">
                  <p *ngIf="field.hint" class="text-xs text-gray-500 mt-1">{{ field.hint }}</p>
                  <p *ngIf="isFieldInvalid(field.name)" class="text-xs text-red-500 mt-1">
                    {{ getFieldError(field.name) }}
                  </p>
                </div>

                <!-- Select -->
                <div *ngIf="field.type === 'select'" class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                    <span class="text-red-500" *ngIf="isFieldRequired(field)">*</span>
                  </label>
                  <select 
                    [formControlName]="field.name"
                    [disabled]="field.disabled"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    [class.border-red-500]="isFieldInvalid(field.name)">
                    <option value="">{{ field.placeholder || 'Seleccionar...' }}</option>
                    <option *ngFor="let option of field.options" [value]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <p *ngIf="field.hint" class="text-xs text-gray-500 mt-1">{{ field.hint }}</p>
                  <p *ngIf="isFieldInvalid(field.name)" class="text-xs text-red-500 mt-1">
                    {{ getFieldError(field.name) }}
                  </p>
                </div>

                <!-- Textarea -->
                <div *ngIf="field.type === 'textarea'" class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                    <span class="text-red-500" *ngIf="isFieldRequired(field)">*</span>
                  </label>
                  <textarea 
                    [formControlName]="field.name"
                    [placeholder]="field.placeholder || ''"
                    [disabled]="field.disabled"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-vertical"
                    [class.border-red-500]="isFieldInvalid(field.name)">
                  </textarea>
                  <p *ngIf="field.hint" class="text-xs text-gray-500 mt-1">{{ field.hint }}</p>
                  <p *ngIf="isFieldInvalid(field.name)" class="text-xs text-red-500 mt-1">
                    {{ getFieldError(field.name) }}
                  </p>
                </div>

                <!-- Checkbox -->
                <div *ngIf="field.type === 'checkbox'" class="form-group">
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      [formControlName]="field.name"
                      [disabled]="field.disabled"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed">
                    <span class="text-sm font-medium text-gray-700">{{ field.label }}</span>
                  </label>
                  <p *ngIf="field.hint" class="text-xs text-gray-500 mt-1 ml-7">{{ field.hint }}</p>
                </div>
              </div>
            </div>

            <!-- Custom Content Slot -->
            <div class="mt-6" *ngIf="!isLoading">
              <ng-content></ng-content>
            </div>
          </form>

          <!-- Footer -->
          <div class="bg-gradient-to-r from-gray-100 to-gray-200 border-t border-gray-300 px-6 py-5">
            <div class="flex items-center justify-center space-x-4">
              <button type="button" 
                      (click)="onCancel()"
                      [disabled]="isLoading"
                      class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
                <i class="fas fa-times mr-2"></i>
                {{ cancelText || 'Cancelar' }}
              </button>
              <button type="submit" 
                      (click)="onSubmit()"
                      [disabled]="isLoading || form.invalid"
                      class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
                <i class="fas fa-spinner fa-spin mr-2" *ngIf="isLoading"></i>
                <i class="fas fa-save mr-2" *ngIf="!isLoading"></i>
                {{ submitText || (isEditing ? 'Actualizar' : 'Guardar') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./universal-form-modal.component.scss']
})
export class FormModalComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Input() form!: FormGroup;
  @Input() fields: FormField[] = [];
  @Input() title = '';
  @Input() subtitle = '';
  @Input() headerIcon = '';
  @Input() isLoading = false;
  @Input() loadingText = '';
  @Input() submitText = '';
  @Input() cancelText = '';
  @Input() isEditing = false;

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void {
    // Add escape key listener
    document.addEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  onSubmit(): void {
    if (this.form.valid && !this.isLoading) {
      this.submit.emit(this.form.value);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isVisible) {
      this.onCancel();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  isFieldRequired(field: FormField): boolean {
    const control = this.form.get(field.name);
    return control?.hasError('required') ?? false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;
      if (control.errors['max']) return `Valor máximo: ${control.errors['max'].max}`;
      if (control.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }
}