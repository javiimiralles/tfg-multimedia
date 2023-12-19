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

@NgModule({
  declarations: [
    AdminLayoutComponent,
    HomeComponent
  ],
  exports: [
    AdminLayoutComponent,
    HomeComponent
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
    ComponentsModule
  ]
})
export class PagesModule { }
