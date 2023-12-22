import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { AlimentosViewComponent } from './alimentos/alimentos-view/alimentos-view.component';
import { PesosViewComponent } from './pesos/pesos-view/pesos-view.component';
import { ActividadFisicaViewComponent } from './actividad-fisica/actividad-fisica-view/actividad-fisica-view.component';

const routes: Routes = [
  { path: '', component: AdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent, data: {
                                                  simpleHeader: false,
                                                  titulo: 'Inicio',
                                                  leftButtonIcon: '',
                                                  leftButtonUrl: '',
                                                  backButtonUrl: ''
                                                }},
      { path: 'alimentos/view', component: AlimentosViewComponent, data: {
                                                                    simpleHeader: false,
                                                                    titulo: 'Registro de alimentos',
                                                                    leftButtonIcon: 'fa-solid fa-glass-water',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: ''
                                                                  }},
      { path: 'registros-peso/view', component: PesosViewComponent, data: {
                                                                    simpleHeader: false,
                                                                    titulo: 'Registros de peso',
                                                                    leftButtonIcon: 'fa-solid fa-bell',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: ''
                                                                  }},
      { path: 'actividad-fisica/view', component: ActividadFisicaViewComponent, data: {
                                                                  simpleHeader: false,
                                                                  titulo: 'Actividad física',
                                                                  leftButtonIcon: 'fa-solid fa-bell',
                                                                  leftButtonUrl: '',
                                                                  backButtonUrl: ''
                                                                }},
      { path: '**', redirectTo: 'home' }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
