import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { VehiculosRoutingModule } from './vehiculos-routing.module';
import { VehiculoListComponent } from './vehiculo-list/vehiculo-list.component';
import { VehiculoFormModalComponent } from './vehiculo-form-modal/vehiculo-form-modal.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    VehiculoListComponent,
    VehiculoFormModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    VehiculosRoutingModule,
    SharedModule
  ]
})
export class VehiculosModule { }