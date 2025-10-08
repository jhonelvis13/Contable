import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReporteListComponent } from './reporte-list/reporte-list.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ReporteListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportesRoutingModule,
    SharedModule
  ]
})
export class ReportesModule { }