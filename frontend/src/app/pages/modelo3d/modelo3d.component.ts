import { Component, OnInit } from '@angular/core';
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
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.getUrlModelo3D();
  }

  getUrlModelo3D() {
    this.modelos3dService.getUrlModelo3DByUser().subscribe(res => {
      if(res['url']) {
        this.urlModelo = res['url'];
        console.log(this.urlModelo);
        this.cargarModelo3D();
      } else {
        this.loadingModel = false;
      }
    });
  }

  cargarModelo3D() {
    this.motorGraficoService.init();
    this.loadingModel = !this.motorGraficoService.isLoaded;

    this.motorGraficoService.loadModel(this.urlModelo, () => {
      if(!this.motorGraficoService.isLoaded) {
        this.loadingModel = false;
        this.existeModelo = true;
        this.motorGraficoService.render();
      }
    })
  }

}
