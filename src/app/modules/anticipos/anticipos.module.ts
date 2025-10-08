// src/app/modules/anticipos/anticipos.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AnticipoListComponent } from './anticipo-list/anticipo-list.component';
import { AnticipoFormModalComponent } from './anticipo-form-modal/anticipo-form-modal.component';

const routes: Routes = [
  { path: '', component: AnticipoListComponent }
];

@NgModule({
  declarations: [
    AnticipoListComponent,
    AnticipoFormModalComponent
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
    AnticipoListComponent,
    AnticipoFormModalComponent
  ]
})
export class AnticiposModule { }