import { Component, OnInit } from '@angular/core';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { Modelos3DService } from 'src/app/services/modelos3D.service';
import { MotorGraficoService } from 'src/app/services/motor-grafico.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modelo3d',
  templateUrl: './modelo3d.component.html',
  styleUrls: ['./modelo3d.component.scss'],
})
export class Modelo3dComponent  implements OnInit {

  urlModelo: string;
  existeModelo: boolean = false;
  loadingModel: boolean = true;

  constructor(
    private modelos3dService: Modelos3DService,
    private motorGraficoService: MotorGraficoService,
    private toastService: ToastService,
    private exceptionsService: ExceptionsService
  ) { }

  ngOnInit() {
    this.getModelos3D();
    this.cargarModelo3D();
  }

  getModelos3D() {
    this.modelos3dService.getModelos3DByUser().subscribe({
      next: (res) => {

      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  cargarModelo3D() {
    this.loadingModel = true;
    this.motorGraficoService.init();
    this.loadingModel = !this.motorGraficoService.isLoaded;

    this.urlModelo = './assets/modelo3D/Model.obj';
    this.motorGraficoService.loadModel('./assets/modelo3D/light.hdr', this.urlModelo, () => {
      if(!this.motorGraficoService.isLoaded) {
        this.loadingModel = false;
        this.existeModelo = true;
        this.motorGraficoService.render();
      }
    })
  }

}
