import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../core/services/cliente.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';
import { FormField } from '../../../shared/components/universal-form-modal/universal-form-modal.component';

@Component({
  selector: 'app-cliente-form-modal',
  templateUrl: './cliente-form-modal.component.html',
  styleUrls: ['./cliente-form-modal.component.scss']
})
export class ClienteFormModalComponent implements OnInit {
  @Input() data: Cliente | null = null;
  @Input() isVisible: boolean = false;
  @Input() editMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveData = new EventEmitter<Cliente>();

  clienteForm: FormGroup;
  isLoading = false;
  formFields: FormField[] = [];

  get clienteData(): Cliente {
    return this.data!;
  }

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {
    this.clienteForm = this.createForm();
    this.setupFormFields();
  }

  ngOnInit(): void {
    this.setupFormFields();
    if (this.data) {
      this.loadClienteData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      nit: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.email]],
      contacto: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      activo: [true]
    });
  }

  private setupFormFields(): void {
    this.formFields = [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ingrese el nombre del cliente',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'nit',
        label: 'NIT',
        type: 'text',
        placeholder: 'Ej: 123456789',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
      },
      {
        name: 'tipo',
        label: 'Tipo de Cliente',
        type: 'select',
        placeholder: 'Seleccione un tipo',
        disabled: false,
        colspan: 2,
        options: [
          { value: 'EMPRESA', label: 'Empresa' },
          { value: 'INDIVIDUAL', label: 'Individual' },
          { value: 'GOBIERNO', label: 'Gobierno' },
          { value: 'ONG', label: 'ONG' }
        ],
        validators: [Validators.required]
      },
      {
        name: 'activo',
        label: 'Cliente Activo',
        type: 'checkbox',
        disabled: false,
        colspan: 2,
        hint: 'Marque si el cliente está activo'
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
        name: 'telefono',
        label: 'Teléfono',
        type: 'text',
        placeholder: 'Ej: +591 70123456',
        disabled: false,
        colspan: 2,
        validators: [Validators.required]
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
        name: 'contacto',
        label: 'Persona de Contacto',
        type: 'text',
        placeholder: 'Nombre del contacto principal',
        disabled: false,
        colspan: 4,
        validators: [Validators.required]
      }
    ];

    // Rebuild form with dynamic validators
    const formControls: any = {};
    this.formFields.forEach(field => {
      const validators = field.validators || [];
      const defaultValue = field.type === 'checkbox' ? true : '';
      formControls[field.name] = [defaultValue, validators];
    });

    this.clienteForm = this.fb.group(formControls);
  }

  private loadClienteData(): void {
    if (this.data) {
      this.clienteForm.patchValue({
        nombre: this.data.nombre,
        nit: this.data.nit,
        direccion: this.data.direccion,
        telefono: this.data.telefono,
        email: this.data.email || '',
        contacto: this.data.contacto,
        tipo: this.data.tipo,
        activo: this.data.activo
      });
    }
  }

  onSubmit(formData: any): void {
    this.isLoading = true;
    this.loadingService.startOperationLoading('cliente-save', 'Guardando cliente...');

    const clienteData: Cliente = {
      ...formData,
      id: this.data?.id
    };

    // Guardar cliente con manejo de loading y errores
    this.clienteService.saveCliente(clienteData).subscribe({
      next: (response: Cliente) => {
        this.loadingService.stopLoading('cliente-save');
        this.toastService.success(
          this.data ? 'Cliente actualizado' : 'Cliente creado',
          `El cliente ${response.nombre} se ${this.data ? 'actualizó' : 'creó'} correctamente.`
        );
        this.saveData.emit(response);
        this.onCancel();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.loadingService.stopLoading('cliente-save');
        console.error('Error al guardar cliente:', error);
        this.toastService.error(
          'Error al guardar',
          'No se pudo guardar el cliente. Verifique los datos e intente nuevamente.'
        );
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
