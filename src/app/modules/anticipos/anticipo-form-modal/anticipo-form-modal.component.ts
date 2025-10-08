import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Anticipo } from '../../../core/models/anticipo.model';
import { AnticipoService } from '../../../core/services/anticipo.service';

@Component({
  selector: 'app-anticipo-form-modal',
  templateUrl: './anticipo-form-modal.component.html',
  styleUrls: ['./anticipo-form-modal.component.scss']
})
export class AnticipoFormModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() anticipo: Anticipo | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() anticipoSaved = new EventEmitter<Anticipo>();

  anticipoForm: FormGroup;
  isLoading = false;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private anticipoService: AnticipoService
  ) {
    this.anticipoForm = this.createForm();
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
      tipo: ['Empresa', [Validators.required]],
      viajeDescripcion: [''],
      socioNombre: [''],
      monto: [0, [Validators.required, Validators.min(0.01)]],
      estado: ['Pendiente', [Validators.required]],
      metodoPago: ['Efectivo', [Validators.required]],
      observaciones: ['']
    });
  }

  private initializeForm(): void {
    this.isEditMode = !!this.anticipo;
    
    if (this.anticipo) {
      this.anticipoForm.patchValue({
        tipo: this.anticipo.tipo || 'Empresa',
        viajeDescripcion: this.anticipo.viajeDescripcion || '',
        socioNombre: this.anticipo.socioNombre || '',
        monto: this.anticipo.monto || 0,
        estado: this.anticipo.estado || 'Pendiente',
        metodoPago: this.anticipo.metodoPago || 'Efectivo',
        observaciones: this.anticipo.observaciones || ''
      });
    } else {
      this.anticipoForm.reset({
        tipo: 'Empresa',
        viajeDescripcion: '',
        socioNombre: '',
        monto: 0,
        estado: 'Pendiente',
        metodoPago: 'Efectivo',
        observaciones: ''
      });
    }
  }

  onSubmit(): void {
    if (this.anticipoForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = this.anticipoForm.value;
      const anticipoData: Partial<Anticipo> = {
        ...formData,
        fecha: this.anticipo?.fecha || new Date(),
        montoPagado: this.anticipo?.montoPagado || 0,
        montoPendiente: formData.monto - (this.anticipo?.montoPagado || 0)
      };

      const request = this.isEditMode 
        ? this.anticipoService.updateAnticipo(this.anticipo!.id!, anticipoData)
        : this.anticipoService.createAnticipo(anticipoData);

      request.subscribe({
        next: (anticipo: Anticipo) => {
          this.anticipoSaved.emit(anticipo);
          this.onClose();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al guardar el anticipo:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onClose(): void {
    this.anticipoForm.reset();
    this.isLoading = false;
    this.closeModal.emit();
  }

  // Getters para facilitar el acceso a los controles del formulario
  get tipo() { return this.anticipoForm.get('tipo'); }
  get viajeDescripcion() { return this.anticipoForm.get('viajeDescripcion'); }
  get socioNombre() { return this.anticipoForm.get('socioNombre'); }
  get monto() { return this.anticipoForm.get('monto'); }
  get estado() { return this.anticipoForm.get('estado'); }
  get metodoPago() { return this.anticipoForm.get('metodoPago'); }
  get observaciones() { return this.anticipoForm.get('observaciones'); }

  // Validaciones de campo
  hasError(controlName: string, errorType: string): boolean {
    const control = this.anticipoForm.get(controlName);
    return !!(control && control.errors?.[errorType] && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.anticipoForm.get(controlName);
    if (control?.errors && (control.dirty || control.touched)) {
      const errors = control.errors;
      
      if (errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (errors['min']) {
        return `El valor mínimo es ${errors['min'].min}`;
      }
    }
    return '';
  }
}