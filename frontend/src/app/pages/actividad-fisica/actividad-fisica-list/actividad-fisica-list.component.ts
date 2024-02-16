import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ActividadFisica } from 'src/app/models/actividad-fisica.model';
import { ActividadesFisicasService } from 'src/app/services/actividades-fisicas.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-actividad-fisica-list',
  templateUrl: './actividad-fisica-list.component.html',
  styleUrls: ['./actividad-fisica-list.component.scss'],
})
export class ActividadFisicaListComponent  implements OnInit {

  textoBusqueda: string = '';
  noResultsFound: boolean = false;
  actividadesFisicas: ActividadFisica[] = [];

  segmentActual: 'mis-actividades' | 'biblioteca' = 'mis-actividades';

  constructor(
    private actividadesFisicasService: ActividadesFisicasService,
    private toastService: ToastService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarActividadesFisicas(this.segmentActual === 'biblioteca');
  }

  onSearchbarChange(event) {
    this.textoBusqueda = event.detail.value;
    this.cargarActividadesFisicas(this.segmentActual === 'biblioteca');
  }

  onSegmentChange(event) {
    this.segmentActual = event.detail.value;
    this.cargarActividadesFisicas(this.segmentActual === 'biblioteca');
  }

  cargarActividadesFisicas(defaultOnly: boolean) {
    this.noResultsFound = false;
    this.actividadesFisicas = [];
    this.actividadesFisicasService.cargarActividadesFisicas(this.textoBusqueda, defaultOnly).subscribe(res => {
      this.actividadesFisicas = res['actividadesFisicas'];
      this.comprobarSiHayResultados();
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
      this.comprobarSiHayResultados();
    });
  }

  deleteActividadFisica(uid: string) {
    this.actividadesFisicasService.deleteActividadFisica(uid).subscribe(res => {
      this.toastService.presentToast('Actividad eliminada', 'success');
      this.cargarActividadesFisicas(false);
    }, (err) => {
      console.error(err);
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

  async presentConfirmDeleteAlert(uid: string, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: '¿Quieres eliminar esta actividad?',
      subHeader: 'Se eliminarán todas las actividades realizadas asociadas',
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteActividadFisica(uid);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  comprobarSiHayResultados() {
    this.noResultsFound = this.actividadesFisicas.length == 0;
  }

  goToRegistroActividadFisica(uid: string) {
    this.router.navigate(['/actividad-fisica/registro-actividad-realizada'], { queryParams: { idActividadPadre: uid, idActividadRealizada: 'nuevo' } });
  }

  goToEditarActividadFisica(uid: string, event: Event) {
    event.stopPropagation();
    this.router.navigateByUrl(`/actividad-fisica/form/${uid}`);
  }

}
