import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {

  @Input() progressValue: number;
  @Input() maxValue: number;
  @Input() label: string;
  @Input() color: string;
  @Input() size: string;

  height: string = '20px';

  constructor() { }

  ngOnInit(): void {
    this.height = this.size === 'SMALL' ? '20px' : '40px';
  }

  get percentage(): string {
    return `${(this.progressValue / this.maxValue) * 100}%`;
  }

}
