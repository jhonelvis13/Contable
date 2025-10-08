import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiculoListComponent } from './vehiculo-list/vehiculo-list.component';

const routes: Routes = [
  {
    path: '',
    component: VehiculoListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiculosRoutingModule { }