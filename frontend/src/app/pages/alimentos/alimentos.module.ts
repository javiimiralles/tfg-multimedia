import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlimentosViewComponent } from './alimentos-view/alimentos-view.component';

@NgModule({
  declarations: [
    AlimentosViewComponent
  ],
  exports: [
    AlimentosViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AlimentosModule { }
