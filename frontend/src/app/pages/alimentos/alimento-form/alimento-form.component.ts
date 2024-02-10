import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alimento } from 'src/app/models/alimento.model';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { DiariosService } from 'src/app/services/diarios.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-alimento-form',
  templateUrl: './alimento-form.component.html',
  styleUrls: ['./alimento-form.component.scss'],
})
export class AlimentoFormComponent  implements OnInit {

  idAlimento: string = '';

  nombreInput: string;
  marcaInput: string;
  cantidadInput: number = 100;
  unidadSelect: string = 'gramos';
  unidadPersonalizada: string = '';
  caloriasInput: number;
  carbosInput: number;
  proteinasInput: number;
  grasasInput: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alimentosService: AlimentosService,
    private toastService: ToastService,
    private diariosService: DiariosService) { }

  ngOnInit() {
    this.idAlimento = this.activatedRoute.snapshot.params['uid'];
    if(this.idAlimento === 'capturado') {
      this.fillForm(this.alimentosService.alimentoCapturado);
    } else if(this.idAlimento !== 'nuevo') {
      this.alimentosService.cargarAlimentoPorId(this.idAlimento).subscribe(res => {
        this.fillForm(res['alimento']);
      }, (err) => {
        const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
        this.toastService.presentToast(msg, 'danger');
      });
    }
  }

  fillForm(alimento: Alimento) {
    this.nombreInput = alimento.nombre;
    this.marcaInput = alimento.marca != null ? alimento.marca : '';
    this.cantidadInput = alimento.cantidadReferencia;
    if(alimento.unidadMedida === 'gramos' || alimento.unidadMedida === 'mililitros' || alimento.unidadMedida === 'unidades') {
      this.unidadSelect = alimento.unidadMedida;
    } else {
      this.unidadSelect = 'otro';
      this.unidadPersonalizada = alimento.unidadMedida;
    }
    this.caloriasInput = alimento.calorias;
    this.carbosInput = alimento.carbohidratos;
    this.proteinasInput = alimento.proteinas;
    this.grasasInput = alimento.grasas;
  }

  checkUnidad(event: any) {
    if (event.detail.value !== 'otro') {
      this.unidadPersonalizada = '';
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const unidad = this.unidadSelect !== 'otro' ? this.unidadSelect : this.unidadPersonalizada;
      const alimento = new Alimento(null, this.nombreInput, this.marcaInput, this.cantidadInput, unidad, this.caloriasInput,
        this.carbosInput, this.proteinasInput, this.grasasInput);

      if(this.idAlimento === 'nuevo' || this.idAlimento === 'capturado') {
        this.createAlimento(alimento);
      } else {
        this.updateAlimento(alimento);
      }
    } else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  createAlimento(alimento: Alimento) {
    this.alimentosService.createAlimento(alimento).subscribe(res => {
      this.diariosService.idAlimentoActual = res['alimento'].uid;
      this.router.navigateByUrl('/alimentos/registro');
      this.toastService.presentToast('Alimento creado', 'success');
    }, (err) => {
      this.router.navigateByUrl('/alimentos/list');
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

  updateAlimento(alimento: Alimento) {
    this.alimentosService.updateAlimento(this.idAlimento, alimento).subscribe(res => {
      this.diariosService.idAlimentoActual = this.idAlimento;
      this.router.navigateByUrl('/alimentos/registro');
      this.toastService.presentToast('Alimento editado', 'success');
    }, (err) => {
      this.router.navigateByUrl('/alimentos/list');
      const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    });
  }

}
