// src/app/modules/clientes/clientes.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientesRoutingModule } from './clientes-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteFormModalComponent } from './cliente-form-modal/cliente-form-modal.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';

@NgModule({
  declarations: [
    ClienteListComponent,
    ClienteFormModalComponent,
    ClienteDetalleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClientesRoutingModule,
    SharedModule,
    MatDialogModule
  ],
  exports: [
    ClienteListComponent,
    ClienteFormModalComponent,
    ClienteDetalleComponent
  ]
})
export class ClientesModule { }
