import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistroPeso } from 'src/app/models/registro-peso.model';
import { PesosService } from 'src/app/services/pesos.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-pesos-form-modal',
  templateUrl: './pesos-form-modal.component.html',
  styleUrls: ['./pesos-form-modal.component.scss'],
})
export class PesosFormModalComponent  implements OnInit {

  fechaSeleccionada: Date = new Date();
  fechaFormateada: string = '';
  peso: number = this.usuariosService.pesoActual;
  showError: boolean = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private usuariosService: UsuariosService,
    private pesosService: PesosService,
    private toastService: ToastService) { }

  ngOnInit() {
    this.fechaSeleccionada = new Date();
    this.fechaFormateada = new Date().toLocaleDateString();
  }

  enviarFormulario() {
    if(this.peso != null && this.peso > 0) {
      this.showError = false;
      const date: Date = new Date(this.fechaSeleccionada);
      const registro: RegistroPeso = new RegistroPeso(null, date, this.peso);
      this.crearRegistroPeso(registro);
    } else {
      this.showError = true;
    }
  }

  crearRegistroPeso(registro: RegistroPeso) {
    this.pesosService.createRegistroPeso(registro).subscribe(res => {
      if(res['registro']) {
        this.modalController.dismiss({ nuevoRegistro: true });
        this.toastService.presentToast('Registro de peso creado', 'success');
      }
    }, (err) => {
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    })
  }

  async openDatePicker() {
    const alert = await this.alertController.create({
      header: 'Selecciona una fecha',
      inputs: [
        {
          name: 'fecha',
          type: 'date',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if(data.fecha) {
              this.fechaSeleccionada = data.fecha;
              this.fechaFormateada = this.formatDate(data.fecha);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  formatDate(date: string) {
    const dateArray = date.split('-');
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  }
}
