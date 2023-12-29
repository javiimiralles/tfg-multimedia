import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Diario } from 'src/app/models/diario.model';
import { DiariosService } from 'src/app/services/diarios.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { getAbrebiaturaUnidadMedida } from 'src/app/utils/unidad-medida.utils';

@Component({
  selector: 'app-alimentos-view',
  templateUrl: './alimentos-view.component.html',
  styleUrls: ['./alimentos-view.component.scss'],
})
export class AlimentosViewComponent  implements OnInit {

  selectedDate: Date = new Date();

  loading: boolean = true;

  diario: any = new Diario('');
  planUsuario = this.usuariosService.plan;

  distribucionComidas = this.usuariosService.distribucionComidas;
  categoriasAlimentos: string[] = [];
  caloriasTotalesPorCategoria: number[] = [];

  constructor(
    private router: Router,
    private diariosService: DiariosService,
    private toastService: ToastService,
    private usuariosService: UsuariosService,
    private alertController: AlertController) { }

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
  }

  // Crea un array de number, donde cada numero corresponde a las calorias
  // totales de la comida que ocupa su posicion en distribucionComidas
  calcularCaloriasTotalesPorCategoria() {
    this.caloriasTotalesPorCategoria = [];
    const restoComidas: any[] = []; // son alimentos que no pertenecen a ninguna categoria
    let caloriasRestoComidas: number = 0;
    this.distribucionComidas.forEach(categoria => {
      let caloriasTotales: number = 0;
      this.diario.alimentosConsumidos.forEach(alimento => {
        if(alimento.categoria === categoria) {
          caloriasTotales += alimento.calorias;
        } else if(!this.distribucionComidas.includes(alimento.categoria) && !restoComidas.includes(alimento)) {
          restoComidas.push(alimento);
          caloriasRestoComidas += alimento.calorias;
        }
      });
      this.caloriasTotalesPorCategoria.push(caloriasTotales);
    });

    if(restoComidas.length > 0) {
      this.caloriasTotalesPorCategoria.push(caloriasRestoComidas);
      this.distribucionComidas.push('Otras comidas');
    }
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
        this.cargarDatosIniciales();
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
      this.cargarDatosIniciales();
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
      this.loading = false;
    });
  }

  cargarDatosIniciales() {
    this.loading = false;
    this.getCategorias();
    this.calcularCaloriasTotalesPorCategoria();
  }

  getSubtituloAlimento(alimento: any): string {
    let subtitulo = alimento.idAlimento.marca != null ? alimento.idAlimento.marca : '';
    const cantidadConUnidad = `${alimento.cantidad} ${getAbrebiaturaUnidadMedida(alimento.idAlimento.unidadMedida)}`;
    subtitulo += alimento.idAlimento.marca != null ? ` (${cantidadConUnidad})` : `${cantidadConUnidad}`;
    return subtitulo;
  }

  async presentAlert(index: number) {
    const alert = await this.alertController.create({
      buttons: [
        {
          text: 'Editar cantidad',
          handler: () => {
            console.log(this.diario.alimentosConsumidos[index]);
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteAlimento(index);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAlimento(index: number) {
    this.diariosService.deleteAlimentoConsumido(this.diario.uid, index).subscribe(res => {
      this.toastService.presentToast('Alimento borrado', 'success');
      this.cargarDiarioPorFecha(this.selectedDate);
    }, (err) => {
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

  irAListadoDeAlimentos(categoria: string) {
    this.diariosService.idDiarioActual = this.diario.uid;
    this.diariosService.categoriaActual = categoria;
    this.router.navigateByUrl('/alimentos/list');
  }

}
