// src/app/modules/socios/socio-form-modal.component.ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Socio } from '../../../core/models/socio.model';
import { SocioService } from '../../../core/services/socio.service';

@Component({
  selector: 'app-socio-form-modal',
  templateUrl: './socio-form-modal.component.html',
  styleUrls: ['./socio-form-modal.component.scss']
})
export class SocioFormModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() socio: Socio | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() socioSaved = new EventEmitter<Socio>();

  socioForm: FormGroup;
  isLoading = false;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private socioService: SocioService
  ) {
    this.socioForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.initializeForm();
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      ciNit: [''],
      telefono: [''],
      email: ['', [Validators.email]],
      direccion: [''],
      porcentajeParticipacion: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      activo: [true]
    });
  }

  private initializeForm(): void {
    this.isEditMode = !!this.socio;
    
    if (this.socio) {
      this.socioForm.patchValue({
        nombre: this.socio.nombre || '',
        ciNit: this.socio.ciNit || '',
        telefono: this.socio.telefono || '',
        email: this.socio.email || '',
        direccion: this.socio.direccion || '',
        porcentajeParticipacion: this.socio.porcentajeParticipacion || 0,
        activo: this.socio.activo !== undefined ? this.socio.activo : true
      });
    } else {
      this.socioForm.reset({
        nombre: '',
        ciNit: '',
        telefono: '',
        email: '',
        direccion: '',
        porcentajeParticipacion: 0,
        activo: true
      });
    }
  }

  onSubmit(): void {
    if (this.socioForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = this.socioForm.value;
      const socioData: Partial<Socio> = {
        ...formData,
        createdAt: this.socio?.createdAt || new Date(),
        totalPagado: this.socio?.totalPagado || 0,
        totalPendiente: this.socio?.totalPendiente || 0,
        cantidadViajes: this.socio?.cantidadViajes || 0
      };

      const request = this.isEditMode 
        ? this.socioService.updateSocio(this.socio!.id!, socioData)
        : this.socioService.createSocio(socioData);

      request.subscribe({
        next: (socio: Socio) => {
          this.socioSaved.emit(socio);
          this.onClose();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al guardar el socio:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onClose(): void {
    this.socioForm.reset();
    this.isLoading = false;
    this.closeModal.emit();
  }

  // Getters para facilitar el acceso a los controles del formulario
  get nombre() { return this.socioForm.get('nombre'); }
  get ciNit() { return this.socioForm.get('ciNit'); }
  get telefono() { return this.socioForm.get('telefono'); }
  get email() { return this.socioForm.get('email'); }
  get direccion() { return this.socioForm.get('direccion'); }
  get porcentajeParticipacion() { return this.socioForm.get('porcentajeParticipacion'); }
  get activo() { return this.socioForm.get('activo'); }

  // Validaciones de campo
  hasError(controlName: string, errorType: string): boolean {
    const control = this.socioForm.get(controlName);
    return !!(control && control.errors?.[errorType] && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.socioForm.get(controlName);
    if (control?.errors && (control.dirty || control.touched)) {
      const errors = control.errors;
      
      if (errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (errors['email']) {
        return 'Ingrese un email válido';
      }
      if (errors['minlength']) {
        return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
      if (errors['min']) {
        return `El valor mínimo es ${errors['min'].min}`;
      }
      if (errors['max']) {
        return `El valor máximo es ${errors['max'].max}`;
      }
    }
    return '';
  }
}