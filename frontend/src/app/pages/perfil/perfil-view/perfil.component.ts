import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { PesoObjetivoModalComponent } from '../perfil-modals/peso-objetivo-modal/peso-objetivo-modal.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  nombre: string;
  email: string;
  altura: number;
  edad: number;
  sexo: string;
  pesoObjetivo: number;
  pesoObjetivoEntero: number;
  pesoObjetivoDecimal: number;
  plan: any;
  distribucionComidas: string[];
  configuracion: any;

  establecerObjetivoTxt: string;

  constructor(
    private usuariosService: UsuariosService,
    private toastService: ToastService,
    private modalController: ModalController) {}

  ngOnInit() {
    this.setData();
  }

  setData() {
    this.nombre = this.usuariosService.nombre;
    this.email = this.usuariosService.email;
    this.altura = this.usuariosService.altura;
    this.edad = this.usuariosService.edad;
    this.sexo = this.usuariosService.sexo;
    this.pesoObjetivo = this.usuariosService.pesoObjetivo;
    this.pesoObjetivoEntero = this.pesoObjetivo != null ? Math.floor(this.pesoObjetivo) : 70;
    this.pesoObjetivoDecimal = this.pesoObjetivo != null ? Math.round((this.pesoObjetivo - this.pesoObjetivoEntero)*100) : 0;
    this.plan = this.usuariosService.plan;
    this.distribucionComidas = this.usuariosService.distribucionComidas;
    this.configuracion = this.usuariosService.configuracion;
    this.establecerObjetivoTxt = this.usuariosService.pesoObjetivo ? 'Cambiar peso objetivo' : 'Establecer peso objetivo';
  }

  handleGenderChange(event) {
    this.sexo = event.target.value;
  }

  updateUser() {
    const usuario = new Usuario(this.usuariosService.uid, this.nombre, this.email, null, this.sexo, this.altura, this.edad, null,
      this.pesoObjetivo, null, null, this.plan, this.distribucionComidas, this.configuracion);

    this.usuariosService.updateUser(usuario).subscribe(res => {
      this.updateInfoUser();
      this.toastService.presentToast('Perfil actualizado', 'success');
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    })
  }

  updateInfoUser() {
    this.usuariosService.validarToken().subscribe(res => { this.setData() });
  }

  logout() {
    this.usuariosService.logout();
  }

  // Controladores de los modales
  async openPesoObjetivoModal() {
    const modal = await this.modalController.create({
      component: PesoObjetivoModalComponent,
      componentProps: {
        pesoObjetivoEntero: this.pesoObjetivoEntero,
        pesoObjetivoDecimal: this.pesoObjetivoDecimal,
        establecerObjetivoTxt: this.establecerObjetivoTxt,
        tieneObjetivo: this.pesoObjetivo != null
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) {
      if(data.removePesoObjetivo) {
        this.pesoObjetivoEntero = 70;
        this.pesoObjetivoDecimal = 0;
        this.pesoObjetivo = null;
      } else {
        this.pesoObjetivoEntero = data.pesoObjetivoEntero;
        this.pesoObjetivoDecimal = data.pesoObjetivoDecimal;
        this.pesoObjetivo = this.pesoObjetivoEntero + (this.pesoObjetivoDecimal / 100);
      }

      this.updateUser();
    }
  }

}
