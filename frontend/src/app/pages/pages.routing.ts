import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { AlimentosViewComponent } from './alimentos/alimentos-view/alimentos-view.component';
import { PesosViewComponent } from './pesos/pesos-view/pesos-view.component';
import { ActividadFisicaViewComponent } from './actividad-fisica/actividad-fisica-view/actividad-fisica-view.component';
import { AlimentosListComponent } from './alimentos/alimentos-list/alimentos-list.component';

const routes: Routes = [
  { path: '', component: AdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      /********** Inicio *************/
      { path: 'home', component: HomeComponent, data: {
                                                  simpleHeader: false,
                                                  titulo: 'Inicio',
                                                  leftButtonIcon: '',
                                                  leftButtonUrl: '',
                                                  backButtonUrl: ''
                                                }},
      /********** Alimentos *************/
      { path: 'alimentos', component: AlimentosViewComponent, data: {
                                                                    simpleHeader: false,
                                                                    titulo: 'Registro de alimentos',
                                                                    leftButtonIcon: 'fa-solid fa-glass-water fa-lg',
                                                                    leftButtonUrl: '/consumo-agua',
                                                                    backButtonUrl: ''
                                                                  }},
      { path: 'alimentos-list', component: AlimentosListComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: 'Listado de alimentos',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: '/alimentos'
                                                                  }},
      /********** Peso *************/
      { path: 'registros-peso', component: PesosViewComponent, data: {
                                                                    simpleHeader: false,
                                                                    titulo: 'Registros de peso',
                                                                    leftButtonIcon: 'fa-solid fa-bell fa-lg',
                                                                    leftButtonUrl: '/notificaciones',
                                                                    backButtonUrl: ''
                                                                  }},
      /********** Actividad fisica *************/
      { path: 'actividad-fisica', component: ActividadFisicaViewComponent, data: {
                                                                  simpleHeader: false,
                                                                  titulo: 'Actividad física',
                                                                  leftButtonIcon: 'fa-solid fa-bell fa-lg',
                                                                  leftButtonUrl: '/notificaciones',
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
