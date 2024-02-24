import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { FotoProgreso } from 'src/app/models/foto-progreso.model';
import { FotosProgresoService } from 'src/app/services/fotos-progreso.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-fotos-progreso',
  templateUrl: './fotos-progreso.component.html',
  styleUrls: ['./fotos-progreso.component.scss'],
})
export class FotosProgresoComponent  implements OnInit {

  segmentActual: 'album' | 'comparaciones' = 'album';
  selectedDate: Date = new Date();
  fotosProgreso: FotoProgreso[] = [];
  album: any[] = [];

  constructor(
    private toastService: ToastService,
    private fotosProgresoService: FotosProgresoService,
    private lightbox: Lightbox,
    private lightboxConfig: LightboxConfig,
    private alertController: AlertController
  ) {
    this.lightboxConfig.fadeDuration = 0.5;
    this.lightboxConfig.centerVertically = true;
    this.lightboxConfig.alwaysShowNavOnTouchDevices = true;
    this.lightboxConfig.wrapAround = true;
  }

  ngOnInit() {
    this.cargarFotosProgreso();
  }

  onSegmentChange(event) {
    this.segmentActual = event.detail.value;
  }

  onDateChange(dates: any) {
    this.selectedDate = dates.startDate;
    this.cargarFotosProgreso();
  }

  cargarFotosProgreso() {
    this.fotosProgresoService.cargarFotosProgresoPorFecha(this.selectedDate).subscribe(res => {
      this.fotosProgreso = res['fotosProgreso'];
      this.album = this.fotosProgreso.map(foto => ({ src: foto.url }));
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

  async presentDeletePhotoAlert(index: number, uid: string) {
    this.lightbox.close();
    const alert = await this.alertController.create({
      header: '¿Seguro que quieres borrar la foto?',
      cssClass: 'primer-plano',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteFotoProgreso(index, uid);
          }
        }
      ],
    });

    await alert.present();
  }

  deleteFotoProgreso(index: number, uid: string) {
    this.fotosProgresoService.deleteFotoProgreso(uid).subscribe(res => {
      this.album.splice(index, 1);
      this.fotosProgreso.splice(index, 1);
      this.toastService.presentToast('Foto eliminada', 'success');
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

  // Logica del lightbox
  openLightbox(index: number, uid: string) {
    this.lightbox.open(this.album, index);
    setTimeout(() => this.addDeleteButton(index, uid), 0);
  }

  closeLightbox() {
    this.lightbox.close();
  }

  addDeleteButton(index: number, uid: string) {
    const lightboxElem = document.querySelector('.lb-controlContainer');
    if (lightboxElem && !lightboxElem.querySelector('.delete-btn')) {
      const btn = document.createElement('div');
      btn.innerHTML = '<ion-icon color="danger" name="trash-outline"></ion-icon>';
      btn.classList.add('delete-btn');
      btn.classList.add('lb-closeContainer');
      btn.style.marginRight = '10px';
      btn.style.fontSize = '30px';
      btn.onclick = () => this.presentDeletePhotoAlert(index, uid);
      lightboxElem.appendChild(btn);
    }
  }

}
