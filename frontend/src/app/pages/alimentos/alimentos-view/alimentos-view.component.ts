import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diario } from 'src/app/models/diario.model';
import { DiariosService } from 'src/app/services/diarios.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-alimentos-view',
  templateUrl: './alimentos-view.component.html',
  styleUrls: ['./alimentos-view.component.scss'],
})
export class AlimentosViewComponent  implements OnInit {

  selectedDate: Date = new Date();

  loading: boolean = true;

  diario: Diario;
  planUsuario = this.usuariosService.plan;

  distribucionComidas = this.usuariosService.distribucionComidas;
  categoriasAlimentos: string[] = [];

  constructor(
    private router: Router,
    private diariosService: DiariosService,
    private toastService: ToastService,
    private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.loading = true;
    this.cargarDiarioPorFecha(this.selectedDate);
  }

  getCategorias() {
    const alimentos = this.diario.alimentosConsumidos;
    alimentos.forEach(alimento => {
      if(!this.categoriasAlimentos.includes(alimento.categoria)) {
        this.categoriasAlimentos.push(alimento.categoria);
      }
    });
    console.log(this.categoriasAlimentos);
  }

  onDateChange(newDate: Date) {
    this.selectedDate = newDate;
    this.cargarDiarioPorFecha(this.selectedDate);
  }

  cargarDiarioPorFecha(date: Date) {
    this.diariosService.cargarDiarioPorFecha(date).subscribe(res => {
      if(!res['diario']) {
        this.crearDiario(date);
      } else {
        this.diario = res['diario'];
        this.loading = false;
        this.getCategorias();
      }
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
      this.loading = false;
    });
  }

  crearDiario(date: Date) {
    this.diariosService.crearDiario(date).subscribe(res => {
      this.diario = res['diario'];
      this.loading = false;
      this.getCategorias();
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
      this.loading = false;
    });
  }

}
