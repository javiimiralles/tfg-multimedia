import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DatePickerComponent } from './date-picker/date-picker.component';

@NgModule({
  declarations: [
    ProgressBarComponent,
    DatePickerComponent
  ],
  exports: [
    ProgressBarComponent,
    DatePickerComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
  ]
})
export class ComponentsModule { }
