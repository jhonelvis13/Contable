import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConductorService } from '../../../core/services/conductor.service';
import { Conductor } from '../../../core/models/conductor.model';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';
import { FormField } from '../../../shared/components/universal-form-modal/universal-form-modal.component';

@Component({
  selector: 'app-conductor-form-modal',
  templateUrl: './conductor-form-modal.component.html',
  styleUrls: ['./conductor-form-modal.component.scss']
})
export class ConductorFormModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() data: Conductor | null = null;
  @Input() editMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveData = new EventEmitter<Conductor>();

  formFields: FormField[] = [];
  modalTitle: string = 'Conductor';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private conductorService: ConductorService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.setupFormFields();
    this.createForm();
    this.loadDataIfEdit();
  }

  private setupFormFields(): void {
    this.formFields = [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ingrese el nombre',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.minLength(2)]
      },
      {
        name: 'apellido',
        label: 'Apellido',
        type: 'text',
        placeholder: 'Ingrese el apellido',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.minLength(2)]
      },
      {
        name: 'ci',
        label: 'Cédula de Identidad',
        type: 'text',
        placeholder: 'Ej: 1234567 LP',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.minLength(6)]
      },
      {
        name: 'fechaNacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'telefono',
        label: 'Teléfono',
        type: 'text',
        placeholder: 'Ej: +591 70123456',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.minLength(8)]
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'ejemplo@correo.com',
        disabled: false,
        colspan: 2,
        validators: [Validators.email]
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'textarea',
        placeholder: 'Ingrese la dirección completa',
        disabled: false,
        colspan: 4,
        validators: [Validators.required]
      },
      {
        name: 'licenciaNumero',
        label: 'Número de Licencia',
        type: 'text',
        placeholder: 'Ej: 12345678',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'licenciaCategoria',
        label: 'Categoría de Licencia',
        type: 'select',
        placeholder: 'Seleccione categoría',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'A', label: 'Categoría A' },
          { value: 'B', label: 'Categoría B' },
          { value: 'C', label: 'Categoría C' },
          { value: 'D', label: 'Categoría D' },
          { value: 'E', label: 'Categoría E' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'licenciaFechaEmision',
        label: 'Fecha Emisión Licencia',
        type: 'date',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'licenciaFechaVencimiento',
        label: 'Fecha Vencimiento Licencia',
        type: 'date',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'licenciaEstado',
        label: 'Estado de Licencia',
        type: 'select',
        placeholder: 'Seleccione estado',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'VIGENTE', label: 'Vigente' },
          { value: 'VENCIDA', label: 'Vencida' },
          { value: 'SUSPENDIDA', label: 'Suspendida' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'estado',
        label: 'Estado del Conductor',
        type: 'select',
        placeholder: 'Seleccione estado',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'ACTIVO', label: 'Activo' },
          { value: 'SUSPENDIDO', label: 'Suspendido' },
          { value: 'LICENCIA_MEDICA', label: 'Licencia Médica' },
          { value: 'INACTIVO', label: 'Inactivo' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'observaciones',
        label: 'Observaciones',
        type: 'textarea',
        placeholder: 'Ingrese observaciones adicionales (opcional)',
        disabled: false,
        colspan: 4,
        hint: 'Campo opcional para notas adicionales'
      }
    ];

  }

  private createForm(): void {
    const formControls: any = {};
    this.formFields.forEach(field => {
      const validators = field.validators || [];
      const defaultValue = field.name === 'estado' ? 'ACTIVO' : 
                          field.name === 'licenciaEstado' ? 'VIGENTE' : '';
      formControls[field.name] = [defaultValue, validators];
    });

    this.form = this.fb.group(formControls);
  }

  private loadDataIfEdit(): void {
    if (this.editMode && this.data) {
      // Convertir fechas para el input date
      const fechaNacimiento = this.data.fechaNacimiento 
        ? new Date(this.data.fechaNacimiento).toISOString().split('T')[0] 
        : '';
      const fechaEmision = this.data.licencia?.fechaEmision 
        ? new Date(this.data.licencia.fechaEmision).toISOString().split('T')[0] 
        : '';
      const fechaVencimiento = this.data.licencia?.fechaVencimiento 
        ? new Date(this.data.licencia.fechaVencimiento).toISOString().split('T')[0] 
        : '';

      this.form.patchValue({
        nombre: this.data.nombre,
        apellido: this.data.apellido,
        ci: this.data.ci,
        fechaNacimiento: fechaNacimiento,
        telefono: this.data.telefono,
        email: this.data.email,
        direccion: this.data.direccion,
        licenciaNumero: this.data.licencia?.numero || '',
        licenciaCategoria: this.data.licencia?.categoria || '',
        licenciaFechaEmision: fechaEmision,
        licenciaFechaVencimiento: fechaVencimiento,
        licenciaEstado: this.data.licencia?.estado || 'VIGENTE',
        estado: this.data.estado,
        observaciones: this.data.observaciones
      });
    }
  }

  onSubmit(formData: any): void {
    this.loadingService.startLoading('conductor-form', 'overlay', 'Guardando conductor...');

    // Restructurar los datos para incluir la licencia como objeto
    const conductorData = {
      ...formData,
      licencia: {
        numero: formData.licenciaNumero,
        categoria: formData.licenciaCategoria,
        fechaEmision: formData.licenciaFechaEmision,
        fechaVencimiento: formData.licenciaFechaVencimiento,
        estado: formData.licenciaEstado
      }
    };

    // Eliminar campos de licencia del nivel superior
    delete conductorData.licenciaNumero;
    delete conductorData.licenciaCategoria;
    delete conductorData.licenciaFechaEmision;
    delete conductorData.licenciaFechaVencimiento;
    delete conductorData.licenciaEstado;

    if (this.editMode && this.data) {
      // Actualizar conductor existente
      this.conductorService.updateConductor(this.data.id!, conductorData).subscribe({
        next: (response) => {
          this.loadingService.stopLoading('conductor-form');
          this.toastService.success('¡Éxito!', 'Conductor actualizado exitosamente');
          this.saveData.emit(response!);
        },
        error: (error) => {
          this.loadingService.stopLoading('conductor-form');
          console.error('Error al actualizar conductor:', error);
          this.toastService.error('Error', 'Error al actualizar el conductor. Por favor, intente nuevamente.');
        }
      });
    } else {
      // Crear nuevo conductor
      this.conductorService.createConductor(conductorData).subscribe({
        next: (response) => {
          this.loadingService.stopLoading('conductor-form');
          this.toastService.success('¡Éxito!', 'Conductor creado exitosamente');
          this.saveData.emit(response!);
        },
        error: (error) => {
          this.loadingService.stopLoading('conductor-form');
          console.error('Error al crear conductor:', error);
          this.toastService.error('Error', 'Error al crear el conductor. Por favor, intente nuevamente.');
        }
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}