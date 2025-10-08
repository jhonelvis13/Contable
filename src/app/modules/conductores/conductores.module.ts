import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ConductoresRoutingModule } from './conductores-routing.module';
import { ConductorListComponent } from './conductor-list/conductor-list.component';
import { ConductorFormModalComponent } from './conductor-form-modal/conductor-form-modal.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ConductorListComponent,
    ConductorFormModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConductoresRoutingModule,
    SharedModule
  ]
})
export class ConductoresModule { }