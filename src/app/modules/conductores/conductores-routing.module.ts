import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConductorListComponent } from './conductor-list/conductor-list.component';

const routes: Routes = [
  {
    path: '',
    component: ConductorListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConductoresRoutingModule { }