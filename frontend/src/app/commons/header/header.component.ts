import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivationEnd } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  private sub$: Subscription;
  simpleHeader: boolean = false;
  titulo: string = '';
  leftButtonIcon: string = '';
  leftButtonUrl: string = '';
  withBackButton: boolean = false;
  backButtonUrl: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.sub$ = this.getData().subscribe(data => {
      this.simpleHeader = data['simpleHeader'],
      this.titulo = data['titulo'],
      this.leftButtonIcon = data['leftButtonIcon'],
      this.leftButtonUrl = data['leftButtonUrl'],
      this.backButtonUrl = data['backButtonUrl']
    });
  }

  getData() {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

}
