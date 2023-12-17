import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PesosViewComponent } from './pesos-view/pesos-view.component';



@NgModule({
  declarations: [
    PesosViewComponent
  ],
  exports: [
    PesosViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PesosModule { }
