import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  declarations: [
    ProgressBarComponent
  ],
  exports: [
    ProgressBarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
  ]
})
export class ComponentsModule { }
