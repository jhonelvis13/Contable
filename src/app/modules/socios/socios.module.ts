// src/app/modules/socios/socios.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

import { SocioListComponent } from './socio-list/socio-list.component';
import { SocioFormModalComponent } from './socio-form-modal/socio-form-modal.component';
import { SocioDetalleComponent } from './socio-detalle/socio-detalle.component';

const routes: Routes = [
  { path: '', component: SocioListComponent },
  { path: ':id', component: SocioDetalleComponent }
];

@NgModule({
  declarations: [
    SocioListComponent,
    SocioFormModalComponent,
    SocioDetalleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatDialogModule
  ],
  exports: [
    SocioListComponent,
    SocioFormModalComponent,
    SocioDetalleComponent
  ]
})
export class SociosModule { }