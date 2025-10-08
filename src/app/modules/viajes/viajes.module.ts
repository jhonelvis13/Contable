// src/app/modules/viajes/viajes.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ViajeListComponent } from './viaje-list/viaje-list.component';
import { ViajeFormModalComponent } from './viaje-form-modal/viaje-form-modal.component';
import { ViajeDetalleComponent } from './viaje-detalle/viaje-detalle.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ViajeListComponent },
  { path: ':id', component: ViajeDetalleComponent }
];

@NgModule({
  declarations: [
    ViajeListComponent,
    ViajeFormModalComponent,
    ViajeDetalleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ViajesModule { }