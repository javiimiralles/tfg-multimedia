import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { AlimentosViewComponent } from './alimentos/alimentos-view/alimentos-view.component';
import { PesosViewComponent } from './pesos/pesos-view/pesos-view.component';
import { ActividadFisicaViewComponent } from './actividad-fisica/actividad-fisica-view/actividad-fisica-view.component';
import { AlimentosListComponent } from './alimentos/alimentos-list/alimentos-list.component';
import { RegistroAlimentoFormComponent } from './alimentos/registro-alimento-form/registro-alimento-form.component';
import { AlimentoFormComponent } from './alimentos/alimento-form/alimento-form.component';
import { ConsumoAguaComponent } from './consumo-agua/consumo-agua.component';
import { PerfilComponent } from './perfil/perfil-view/perfil.component';
import { AlimentosBarcodeScannerComponent } from './alimentos/alimentos-barcode-scanner/alimentos-barcode-scanner.component';

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
                                                                    leftButtonIcon: 'water-outline',
                                                                    leftButtonUrl: '/consumo-agua',
                                                                    backButtonUrl: ''
                                                                  }},
      { path: 'alimentos/list', component: AlimentosListComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: 'Listado de alimentos',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: '/alimentos'
                                                                  }},
      { path: 'alimentos/registro', component: RegistroAlimentoFormComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: 'Añadir alimento',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: '/alimentos/list'
                                                                  }},
      { path: 'alimentos/form/:uid', component: AlimentoFormComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: 'Crear alimento',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: '/alimentos/list'
                                                                  }},
      { path: 'alimentos/barcode-scanner', component: AlimentosBarcodeScannerComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: '',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: ''
                                                                  }},
      /********** Peso *************/
      { path: 'registros-peso', component: PesosViewComponent, data: {
                                                                    simpleHeader: false,
                                                                    titulo: 'Registros de peso',
                                                                    leftButtonIcon: 'notifications-outline',
                                                                    leftButtonUrl: '/notificaciones',
                                                                    backButtonUrl: ''
                                                                  }},
      /********** Actividad fisica *************/
      { path: 'actividad-fisica', component: ActividadFisicaViewComponent, data: {
                                                                  simpleHeader: false,
                                                                  titulo: 'Actividad física',
                                                                  leftButtonIcon: 'notifications-outline',
                                                                  leftButtonUrl: '/notificaciones',
                                                                  backButtonUrl: ''
                                                                }},
      /********** Consumo agua *************/
      { path: 'consumo-agua', component: ConsumoAguaComponent, data: {
                                                                  simpleHeader: false,
                                                                  titulo: 'Consumo de agua',
                                                                  leftButtonIcon: 'notifications-outline',
                                                                  leftButtonUrl: '/notificaciones',
                                                                  backButtonUrl: ''
                                                                }},
      /********** Perfil *************/
      { path: 'perfil', component: PerfilComponent, data: {
                                                                simpleHeader: false,
                                                                titulo: 'Mi perfil',
                                                                leftButtonIcon: '',
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
