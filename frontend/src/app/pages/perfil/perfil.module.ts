import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfilComponent } from './perfil-view/perfil.component';
import { PesoObjetivoModalComponent } from './perfil-modals/peso-objetivo-modal/peso-objetivo-modal.component';
import { CambiarPlanModalComponent } from './perfil-modals/cambiar-plan-modal/cambiar-plan-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    PerfilComponent,
    PesoObjetivoModalComponent,
    CambiarPlanModalComponent
  ],
  exports: [
    PerfilComponent,
    PesoObjetivoModalComponent,
    CambiarPlanModalComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,

    ComponentsModule
  ]
})
export class PerfilModule { }
