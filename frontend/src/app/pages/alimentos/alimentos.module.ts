import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlimentosViewComponent } from './alimentos-view/alimentos-view.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CommonsModule } from 'src/app/commons/commons.module';

@NgModule({
  declarations: [
    AlimentosViewComponent
  ],
  exports: [
    AlimentosViewComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    ComponentsModule,
    CommonsModule
  ]
})
export class AlimentosModule { }
