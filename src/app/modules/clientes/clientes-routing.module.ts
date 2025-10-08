// src/app/modules/clientes/clientes-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';

const routes: Routes = [
  { path: '', component: ClienteListComponent },
  { path: ':id', component: ClienteDetalleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
