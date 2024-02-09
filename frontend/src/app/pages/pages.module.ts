import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { AlimentosModule } from './alimentos/alimentos.module';
import { PesosModule } from './pesos/pesos.module';
import { ActividadFisicaModule } from './actividad-fisica/actividad-fisica.module';
import { CommonsModule } from '../commons/commons.module';
import { ComponentsModule } from '../components/components.module';
import { ConsumoAguaComponent } from './consumo-agua/consumo-agua.component';
import { PerfilModule } from './perfil/perfil.module';
import { MedidasCorporalesComponent } from './medidas-corporales/medidas-corporales.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    HomeComponent,
    ConsumoAguaComponent,
    MedidasCorporalesComponent
  ],
  exports: [
    AdminLayoutComponent,
    HomeComponent,
    ConsumoAguaComponent,
    MedidasCorporalesComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    AlimentosModule,
    PesosModule,
    ActividadFisicaModule,
    CommonsModule,
    ComponentsModule,
    PerfilModule
  ]
})
export class PagesModule { }
