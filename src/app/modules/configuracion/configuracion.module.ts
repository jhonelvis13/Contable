import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ConfiguracionListComponent } from './configuracion-list/configuracion-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ConfiguracionListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfiguracionRoutingModule,
    SharedModule
  ]
})
export class ConfiguracionModule { }