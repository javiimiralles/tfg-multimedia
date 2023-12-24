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

  sidebarItems = [
    { nombre: 'Inicio', icono: 'fa-solid fa-house', url: '/home' },
    { nombre: 'Alimentos', icono: 'fa-solid fa-utensils', url: '/alimentos' },
    { nombre: 'Registros de peso', icono: 'fa-solid fa-weight-scale', url: '/registros-peso' },
    { nombre: 'Actividad física', icono: 'fa-solid fa-person-running', url: '/actividad-fisica' },
    { nombre: 'Consumo de agua', icono: 'fa-solid fa-glass-water', url: '/consumo-agua' },
    { nombre: 'Fotos de progreso', icono: 'fa-solid fa-camera', url: '/fotos-progreso' },
    { nombre: 'Medidas corporales', icono: 'fa-solid fa-ruler', url: '/medidas-corporales' },
    { nombre: 'Perfil', icono: 'fa-solid fa-user', url: '/perfil' },
    { nombre: 'Configuración', icono: 'fa-solid fa-gear', url: '/configuracion' },
  ]

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
