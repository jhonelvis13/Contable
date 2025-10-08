import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViajeService } from '../../../core/services/viaje.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { ConductorService } from '../../../core/services/conductor.service';
import { Viaje } from '../../../core/models/viaje.model';
import { Cliente } from '../../../core/models/cliente.model';
import { Conductor } from '../../../core/models/conductor.model';
import { Vehiculo } from '../../../core/models/vehiculo.model';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';
import { FormField } from '../../../shared/components/universal-form-modal/universal-form-modal.component';

@Component({
  selector: 'app-viaje-form-modal',
  templateUrl: './viaje-form-modal.component.html',
  styleUrls: ['./viaje-form-modal.component.css']
})
export class ViajeFormModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() data: Viaje | null = null;
  @Input() editMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveData = new EventEmitter<Viaje>();

  formFields: FormField[] = [];
  modalTitle: string = 'Viaje';
  form!: FormGroup;

  // Datos para los selects
  clientes: Cliente[] = [];
  conductores: Conductor[] = [];
  vehiculos: Vehiculo[] = [];

  constructor(
    private fb: FormBuilder,
    private viajeService: ViajeService,
    private clienteService: ClienteService,
    private conductorService: ConductorService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSelectData();
    this.setupFormFields();
    this.createForm();
    this.loadDataIfEdit();
  }

  private async loadSelectData(): Promise<void> {
    try {
      // Cargar clientes
      this.clienteService.getClientes().subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.updateClienteOptions();
        },
        error: (error) => console.error('Error al cargar clientes:', error)
      });

      // Cargar conductores
      this.conductorService.getConductores().subscribe({
        next: (conductores) => {
          this.conductores = conductores;
          this.updateConductorOptions();
        },
        error: (error) => console.error('Error al cargar conductores:', error)
      });

      // TODO: Cargar vehículos cuando esté disponible el servicio
      this.vehiculos = [
        { id: 1, placa: 'ABC-1234', marca: 'Toyota', modelo: 'Hiace' } as Vehiculo,
        { id: 2, placa: 'DEF-5678', marca: 'Mercedes', modelo: 'Sprinter' } as Vehiculo,
        { id: 3, placa: 'GHI-9012', marca: 'Ford', modelo: 'Transit' } as Vehiculo
      ];
      this.updateVehiculoOptions();
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  private setupFormFields(): void {
    this.formFields = [
      {
        name: 'tipo',
        label: 'Tipo de Viaje',
        type: 'select',
        placeholder: 'Seleccione tipo',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'Nacional', label: 'Nacional' },
          { value: 'Internacional', label: 'Internacional' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'clienteId',
        label: 'Cliente',
        type: 'select',
        placeholder: 'Seleccione cliente',
        disabled: false,
        colspan: 2,
        options: [],
        validators: [Validators.required]
      },
      {
        name: 'producto',
        label: 'Producto/Carga',
        type: 'text',
        placeholder: 'Ej: Minerales, Alimentos, etc.',
        disabled: false,
        colspan: 4,
        validators: [Validators.required]
      },
      {
        name: 'montoTotal',
        label: 'Monto Total (Bs)',
        type: 'number',
        placeholder: '5000.00',
        disabled: false,
        colspan: 2,
        validators: [Validators.required, Validators.min(0)]
      },
      {
        name: 'anticipo',
        label: 'Anticipo (Bs)',
        type: 'number',
        placeholder: '2000.00',
        disabled: false,
        colspan: 2,
        validators: [Validators.min(0)]
      },
      {
        name: 'conductorId',
        label: 'Conductor',
        type: 'select',
        placeholder: 'Seleccione conductor',
        disabled: false,
        colspan: 2,
        options: [],
        validators: [Validators.required]
      },
      {
        name: 'vehiculoId',
        label: 'Vehículo',
        type: 'select',
        placeholder: 'Seleccione vehículo',
        disabled: false,
        colspan: 2,
        options: [],
        validators: [Validators.required]
      },
      {
        name: 'origen',
        label: 'Origen',
        type: 'text',
        placeholder: 'Ej: La Paz, Bolivia',
        disabled: false,
        colspan: 2,
        validators: []
      },
      {
        name: 'destino',
        label: 'Destino',
        type: 'text',
        placeholder: 'Ej: Santa Cruz, Bolivia',
        disabled: false,
        colspan: 2,
        validators: []
      },
      {
        name: 'fechaInicio',
        label: 'Fecha de Inicio',
        type: 'date',
        disabled: false,
        colspan: 2,
        validators: []
      },
      {
        name: 'fechaFin',
        label: 'Fecha Estimada de Fin',
        type: 'date',
        disabled: false,
        colspan: 2,
        validators: []
      },
      {
        name: 'estado',
        label: 'Estado del Viaje',
        type: 'select',
        placeholder: 'Seleccione estado',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'Pendiente', label: 'Pendiente' },
          { value: 'En curso', label: 'En Curso' },
          { value: 'Finalizado', label: 'Finalizado' },
          { value: 'Cancelado', label: 'Cancelado' }
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

  private updateClienteOptions(): void {
    const clienteField = this.formFields.find(field => field.name === 'clienteId');
    if (clienteField) {
      clienteField.options = this.clientes.map(cliente => ({
        value: cliente.id!,
        label: cliente.nombre
      }));
    }
  }

  private updateConductorOptions(): void {
    const conductorField = this.formFields.find(field => field.name === 'conductorId');
    if (conductorField) {
      conductorField.options = this.conductores.map(conductor => ({
        value: conductor.id!,
        label: `${conductor.nombre} ${conductor.apellido}`
      }));
    }
  }

  private updateVehiculoOptions(): void {
    const vehiculoField = this.formFields.find(field => field.name === 'vehiculoId');
    if (vehiculoField) {
      vehiculoField.options = this.vehiculos.map(vehiculo => ({
        value: vehiculo.id!,
        label: `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`
      }));
    }
  }

  private createForm(): void {
    const formControls: any = {};
    this.formFields.forEach(field => {
      const validators = field.validators || [];
      const defaultValue = field.name === 'estado' ? 'Pendiente' : 
                          field.name === 'anticipo' ? 0 : '';
      formControls[field.name] = [defaultValue, validators];
    });

    this.form = this.fb.group(formControls);

    // Calcular monto pendiente automáticamente
    this.form.get('montoTotal')?.valueChanges.subscribe(() => this.calculateMontoPendiente());
    this.form.get('anticipo')?.valueChanges.subscribe(() => this.calculateMontoPendiente());
  }

  private calculateMontoPendiente(): void {
    const montoTotal = this.form.get('montoTotal')?.value || 0;
    const anticipo = this.form.get('anticipo')?.value || 0;
    const montoPendiente = montoTotal - anticipo;
    // Nota: montoPendiente se calculará en el backend, aquí solo para visualización
  }

  private loadDataIfEdit(): void {
    if (this.editMode && this.data) {
      const fechaInicio = this.data.fechaInicio 
        ? new Date(this.data.fechaInicio).toISOString().split('T')[0] 
        : '';
      const fechaFin = this.data.fechaFin 
        ? new Date(this.data.fechaFin).toISOString().split('T')[0] 
        : '';

      this.form.patchValue({
        tipo: this.data.tipo,
        clienteId: this.data.clienteId,
        producto: this.data.producto,
        montoTotal: this.data.montoTotal,
        anticipo: this.data.anticipo,
        conductorId: this.data.conductorId,
        vehiculoId: this.data.vehiculoId,
        origen: this.data.origen,
        destino: this.data.destino,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        estado: this.data.estado,
        observaciones: this.data.observaciones
      });
    }
  }

  onSubmit(formData: any): void {
    this.loadingService.startLoading('viaje-form', 'overlay', 'Guardando viaje...');

    const viajeData: Viaje = {
      ...formData,
      montoPendiente: (formData.montoTotal || 0) - (formData.anticipo || 0)
    };

    // Si estamos editando, agregar el ID
    if (this.editMode && this.data) {
      viajeData.id = this.data.id;
    }

    this.viajeService.saveViaje(viajeData).subscribe({
      next: (response: Viaje) => {
        this.loadingService.stopLoading('viaje-form');
        const mensaje = this.editMode ? 'Viaje actualizado exitosamente' : 'Viaje creado exitosamente';
        this.toastService.success('¡Éxito!', mensaje);
        this.saveData.emit(response);
      },
      error: (error: any) => {
        this.loadingService.stopLoading('viaje-form');
        console.error('Error al guardar viaje:', error);
        const mensaje = this.editMode ? 'Error al actualizar el viaje' : 'Error al crear el viaje';
        this.toastService.error('Error', `${mensaje}. Por favor, intente nuevamente.`);
      }
    });
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}