import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ActividadFisicaViewComponent } from './actividad-fisica-view/actividad-fisica-view.component';


@NgModule({
  declarations: [
    ActividadFisicaViewComponent
  ],
  exports: [
    ActividadFisicaViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ActividadFisicaModule { }
