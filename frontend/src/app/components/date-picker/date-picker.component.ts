import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent  implements OnInit {

  @Input() mode: 'day' | 'period' = 'day';
  @Output() dateChange = new EventEmitter<any>();
  startDate: Date = new Date();
  endDate: Date = new Date();
  formatedDate: string = '';

  constructor() { }

  ngOnInit() {
    if(this.mode === 'day') {
      this.startDate = new Date();
      this.endDate = null;
      this.formatedDate = this.formatSimpleDate();
    } else {
      const today = new Date();
      this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      this.formatedDate = this.formatComplexDate();
    }
  }

  changeDate(offset: number) {
    if(this.mode === 'day') {
      this.startDate.setDate(this.startDate.getDate() + offset);
      this.formatedDate = this.formatSimpleDate();
    } else {
      this.startDate.setMonth(this.startDate.getMonth() + offset);
      this.endDate.setMonth(this.endDate.getMonth() + offset);
      this.formatedDate = this.formatComplexDate();
    }

    const dates = { startDate: this.startDate, endDate: this.endDate };
    this.dateChange.emit(dates);
  }

  formatSimpleDate(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.startDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (this.startDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else if (this.startDate.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return this.startDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    }
  }

  formatComplexDate() {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const mes = meses[this.startDate.getMonth()];
    const year = this.startDate.getFullYear();

    return `${mes} ${year}`;
  }

}
