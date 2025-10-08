// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [AuthGuard], // TEMPORALMENTE COMENTADO PARA PRUEBAS
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'viajes', loadChildren: () => import('./modules/viajes/viajes.module').then(m => m.ViajesModule) },
      { path: 'socios', loadChildren: () => import('./modules/socios/socios.module').then(m => m.SociosModule) },
      { path: 'clientes', loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule) },
      { path: 'anticipos', loadChildren: () => import('./modules/anticipos/anticipos.module').then(m => m.AnticiposModule) },
      { path: 'vehiculos', loadChildren: () => import('./modules/vehiculos/vehiculos.module').then(m => m.VehiculosModule) },
      { path: 'conductores', loadChildren: () => import('./modules/conductores/conductores.module').then(m => m.ConductoresModule) },
      { path: 'reportes', loadChildren: () => import('./modules/reportes/reportes.module').then(m => m.ReportesModule) },
      { path: 'configuracion', loadChildren: () => import('./modules/configuracion/configuracion.module').then(m => m.ConfiguracionModule) },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }