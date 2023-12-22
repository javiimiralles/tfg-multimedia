import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent  implements OnInit {

  @Output() dateChange = new EventEmitter<Date>();
  selectedDate: Date = new Date();
  formatedDate: string = '';

  constructor() { }

  ngOnInit() {
    this.formatedDate = this.formatDate();
  }

  changeDate(offset: number) {
    this.selectedDate.setDate(this.selectedDate.getDate() + offset);
    this.formatedDate = this.formatDate();
    this.dateChange.emit(this.selectedDate);
  }

  onDateChange(event: any) {
    console.log('Date changed', event.detail.value);
    // Implement any additional logic needed when the date is changed
  }

  formatDate(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.selectedDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (this.selectedDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else if (this.selectedDate.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return this.selectedDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    }
  }

}
