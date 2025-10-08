import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { Vehiculo } from '../../../core/models/vehiculo.model';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';
import { FormField } from '../../../shared/components/universal-form-modal/universal-form-modal.component';

@Component({
  selector: 'app-vehiculo-form-modal',
  templateUrl: './vehiculo-form-modal.component.html',
  styleUrls: ['./vehiculo-form-modal.component.scss']
})
export class VehiculoFormModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() data: Vehiculo | null = null;
  @Input() editMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveData = new EventEmitter<Vehiculo>();

  formFields: FormField[] = [];
  modalTitle: string = 'Vehículo';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
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
        name: 'placa',
        label: 'Placa',
        type: 'text',
        placeholder: 'Ej: ABC-1234',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.minLength(6)]
      },
      {
        name: 'marca',
        label: 'Marca',
        type: 'text',
        placeholder: 'Ej: Toyota',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'modelo',
        label: 'Modelo',
        type: 'text',
        placeholder: 'Ej: Hiace',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'year',
        label: 'Año',
        type: 'number',
        placeholder: '2020',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]
      },
      {
        name: 'tipo',
        label: 'Tipo de Vehículo',
        type: 'select',
        placeholder: 'Seleccione tipo',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'MINIBUS', label: 'Minibús' },
          { value: 'MICROBUS', label: 'Microbús' },
          { value: 'AUTOBUS', label: 'Autobús' },
          { value: 'CAMION', label: 'Camión' },
          { value: 'PICKUP', label: 'Pickup' },
          { value: 'OTRO', label: 'Otro' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'capacidad',
        label: 'Capacidad (Pasajeros)',
        type: 'number',
        placeholder: '20',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.min(1)]
      },
      {
        name: 'color',
        label: 'Color',
        type: 'text',
        placeholder: 'Ej: Blanco',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'estado',
        label: 'Estado del Vehículo',
        type: 'select',
        placeholder: 'Seleccione estado',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'ACTIVO', label: 'Activo' },
          { value: 'DISPONIBLE', label: 'Disponible' },
          { value: 'MANTENIMIENTO', label: 'En Mantenimiento' },
          { value: 'INACTIVO', label: 'Inactivo' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'seguroCompania',
        label: 'Compañía de Seguro',
        type: 'select',
        placeholder: 'Seleccione compañía',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'SOAT Nacional', label: 'SOAT Nacional' },
          { value: 'La Boliviana Ciacruz', label: 'La Boliviana Ciacruz' },
          { value: 'Nacional Vida', label: 'Nacional Vida' },
          { value: 'Credinform', label: 'Credinform' },
          { value: 'Bisa Seguros', label: 'Bisa Seguros' },
          { value: 'Alianza Seguros', label: 'Alianza Seguros' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'seguroNumero',
        label: 'Número de Póliza',
        type: 'text',
        placeholder: 'Ej: SEG-123456',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'seguroFechaVencimiento',
        label: 'Vencimiento Seguro',
        type: 'date',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'seguroMonto',
        label: 'Monto del Seguro (Bs)',
        type: 'number',
        placeholder: '1500.00',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.min(0)]
      },
      {
        name: 'revisionNumero',
        label: 'Número Revisión Técnica',
        type: 'text',
        placeholder: 'Ej: RT-789123',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'revisionFechaVencimiento',
        label: 'Vencimiento Revisión Técnica',
        type: 'date',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'revisionEstado',
        label: 'Estado Revisión Técnica',
        type: 'select',
        placeholder: 'Seleccione estado',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'VIGENTE', label: 'Vigente' },
          { value: 'VENCIDO', label: 'Vencido' },
          { value: 'PENDIENTE', label: 'Pendiente' }
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
      const defaultValue = field.name === 'estado' ? 'DISPONIBLE' : 
                          field.name === 'revisionEstado' ? 'VIGENTE' : '';
      formControls[field.name] = [defaultValue, validators];
    });

    this.form = this.fb.group(formControls);
  }

  private loadDataIfEdit(): void {
    if (this.editMode && this.data) {
      // Convertir fechas para el input date
      const seguroFecha = this.data.seguro?.fechaVencimiento 
        ? new Date(this.data.seguro.fechaVencimiento).toISOString().split('T')[0] 
        : '';
      const revisionFecha = this.data.revisionTecnica?.fechaVencimiento 
        ? new Date(this.data.revisionTecnica.fechaVencimiento).toISOString().split('T')[0] 
        : '';

      this.form.patchValue({
        placa: this.data.placa,
        marca: this.data.marca,
        modelo: this.data.modelo,
        year: this.data.year,
        tipo: this.data.tipo,
        capacidad: this.data.capacidad,
        color: this.data.color,
        estado: this.data.estado,
        seguroCompania: this.data.seguro?.compania || '',
        seguroNumero: this.data.seguro?.numero || '',
        seguroFechaVencimiento: seguroFecha,
        seguroMonto: this.data.seguro?.monto || '',
        revisionNumero: this.data.revisionTecnica?.numero || '',
        revisionFechaVencimiento: revisionFecha,
        revisionEstado: this.data.revisionTecnica?.estado || 'VIGENTE',
        observaciones: this.data.observaciones
      });
    }
  }

  onSubmit(formData: any): void {
    this.loadingService.startLoading('vehiculo-form', 'overlay', 'Guardando vehículo...');

    // Restructurar los datos para incluir seguro y revisionTecnica como objetos
    const vehiculoData = {
      placa: formData.placa,
      marca: formData.marca,
      modelo: formData.modelo,
      year: formData.year,
      tipo: formData.tipo,
      capacidad: formData.capacidad,
      color: formData.color,
      estado: formData.estado,
      seguro: {
        compania: formData.seguroCompania,
        numero: formData.seguroNumero,
        fechaVencimiento: formData.seguroFechaVencimiento,
        monto: formData.seguroMonto
      },
      revisionTecnica: {
        numero: formData.revisionNumero,
        fechaVencimiento: formData.revisionFechaVencimiento,
        estado: formData.revisionEstado
      },
      observaciones: formData.observaciones
    };

    if (this.editMode && this.data) {
      // Actualizar vehículo existente
      this.vehiculoService.updateVehiculo(this.data.id!, vehiculoData).subscribe({
        next: (response) => {
          this.loadingService.stopLoading('vehiculo-form');
          this.toastService.success('¡Éxito!', 'Vehículo actualizado exitosamente');
          this.saveData.emit(response!);
        },
        error: (error) => {
          this.loadingService.stopLoading('vehiculo-form');
          console.error('Error al actualizar vehículo:', error);
          this.toastService.error('Error', 'Error al actualizar el vehículo. Por favor, intente nuevamente.');
        }
      });
    } else {
      // Crear nuevo vehículo
      this.vehiculoService.createVehiculo(vehiculoData).subscribe({
        next: (response) => {
          this.loadingService.stopLoading('vehiculo-form');
          this.toastService.success('¡Éxito!', 'Vehículo creado exitosamente');
          this.saveData.emit(response!);
        },
        error: (error) => {
          this.loadingService.stopLoading('vehiculo-form');
          console.error('Error al crear vehículo:', error);
          this.toastService.error('Error', 'Error al crear el vehículo. Por favor, intente nuevamente.');
        }
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}