import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  private sub$: Subscription;
  simpleHeader: boolean = false;

  constructor(private router: Router, private menuController: MenuController) { }

  ngOnInit() {
    this.sub$ = this.getData().subscribe(data => {
      this.simpleHeader = data['simpleHeader']
    });
  }

  getData() {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

  closeMenu() {
    this.menuController.close();
  }

}
