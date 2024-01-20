import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diario } from 'src/app/models/diario.model';
import { DiariosService } from 'src/app/services/diarios.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  loading: boolean = true;

  diario: Diario;
  planUsuario = this.usuariosService.plan;

  pesoActual: number = this.usuariosService.pesoActual;
  pesoObjetivo: number = this.usuariosService.pesoObjetivo;

  constructor(
    private router: Router,
    private diariosService: DiariosService,
    private toastService: ToastService,
    private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.loading = true;
    // Cargamos el diario de hoy, si no existe se crea
    this.diariosService.cargarDiarioPorFecha(new Date()).subscribe(res => {
      if(!res['diario']) {
        this.crearDiario();
      } else {
        this.diario = res['diario'];
        this.loading = false;
      }
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
      this.loading = false;
    });
  }

  crearDiario() {
    this.diariosService.crearDiario(new Date()).subscribe(res => {
      this.diario = res['diario'];
      this.loading = false;
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
      this.loading = false;
    });
  }

  redirectTo(url: string) {
    this.router.navigateByUrl(url);
  }

}
