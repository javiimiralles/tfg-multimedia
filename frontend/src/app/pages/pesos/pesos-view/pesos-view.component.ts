import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistroPeso } from 'src/app/models/registro-peso.model';
import { PesosService } from 'src/app/services/pesos.service';
import { ToastService } from 'src/app/services/toast.service';
import { PesosFormModalComponent } from '../pesos-form-modal/pesos-form-modal.component';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-pesos-view',
  templateUrl: './pesos-view.component.html',
  styleUrls: ['./pesos-view.component.scss'],
})
export class PesosViewComponent  implements OnInit {

  segmentActual = 'listado';
  startDate: Date = new Date();
  endDate: Date = new Date();
  registrosPeso: RegistroPeso[] = [];
  variacionesPeso: number[] = [];

  constructor(
    private toastService: ToastService,
    private pesosService: PesosService,
    private modalController: ModalController,
    private usuariosService: UsuariosService,
    private alertController: AlertController) { }

  ngOnInit() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.cargarRegistrosDePeso();
  }

  async openPesosFormModal(registro: RegistroPeso) {
    const modal = await this.modalController.create({
      component: PesosFormModalComponent,
      cssClass: 'custom-modal',
      componentProps: {
        registroEdicion: registro
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data?.ok) {
      this.cargarRegistrosDePeso();
      this.updateInfoUser();
    }
  }

  // Capturdores de eventos
  onSegmentChange(event) {
    this.segmentActual = event.detail.value;
  }

  onDateChange(dates: any) {
    this.startDate = dates.startDate;
    this.endDate = dates.endDate;
    this.cargarRegistrosDePeso();
  }

  cargarRegistrosDePeso() {
    this.pesosService.cargarRegistrosPesoPorFechas(this.startDate, this.endDate).subscribe(res => {
      if(res['registros']) {
        this.registrosPeso = res['registros'];
        this.calcularVariacionesPeso();
      }
    }, (err) => {
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

  calcularVariacionesPeso() {
    let i = 0;
    this.variacionesPeso = [];
    this.registrosPeso.forEach(registro => {
      if(i != this.registrosPeso.length - 1) {
        const variacion: number = Math.round(registro.peso - this.registrosPeso[i+1].peso);
        this.variacionesPeso.push(variacion);
      } else {
        this.variacionesPeso.push(0);
      }
      i++;
    })
  }

  formatVariacionPeso(index: number, variacionPeso: number) {
    let dev: string = '';
    if(index != this.variacionesPeso.length - 1) {
      if(variacionPeso > 0) {
        dev = `+${variacionPeso} kg`;
      } else {
        dev = `${variacionPeso} kg`;
      }
    }
    return dev;
  }

  getVariacionPesoClass(index: number, variacionPeso: number) {
    let clase: string = '';
    if(index != this.variacionesPeso.length - 1) {
      const objetivoUsuario: string = this.usuariosService.plan.tipo;
      if(objetivoUsuario === 'Perder peso') {
        clase = variacionPeso > 0 ? 'danger-color' : 'success-color';
      } else if(objetivoUsuario === 'Ganar peso') {
        clase = variacionPeso < 0 ? 'danger-color' : 'success-color';
      }
    }

    return clase;
  }

  async presentAlert(registro: RegistroPeso) {
    const alert = await this.alertController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Editar registro',
          handler: () => {
            this.openPesosFormModal(registro);
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteRegistroPeso(registro.uid);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteRegistroPeso(uid: string) {
    this.pesosService.deleteRegistroPeso(uid).subscribe(res => {
      this.toastService.presentToast('Registro eliminado', 'success');
      this.cargarRegistrosDePeso();
      this.updateInfoUser();
    }, (err) => {
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

  // Cuando creamos, editamos o eliminamos un registro de peso habra que actualizar
  // la info del usuario para que se actualice su pesoActual
  updateInfoUser() {
    this.usuariosService.validarToken().subscribe(res => {});
  }



}
