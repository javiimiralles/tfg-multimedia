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
    this.cargarModelo3D();
  }

  getUrlModelo3D() {
    this.modelos3dService.getUrlModelo3DByUser().subscribe(res => {
      if(res['url']) {
        this.urlModelo = res['url'];
        this.cargarModelo3D();
      } else {
        this.loadingModel = false;
      }
    });
  }

  cargarModelo3D() {
    this.loadingModel = true;
    this.motorGraficoService.init();
    this.loadingModel = !this.motorGraficoService.isLoaded;

    this.urlModelo = './assets/modelo3D/modelo3d.gltf';
    this.motorGraficoService.loadModel('./assets/modelo3D/light.hdr', this.urlModelo, () => {
      if(!this.motorGraficoService.isLoaded) {
        this.loadingModel = false;
        this.existeModelo = true;
        this.motorGraficoService.render();
      }
    })
  }

}
