import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alimento } from 'src/app/models/alimento.model';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { DiariosService } from 'src/app/services/diarios.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { getAbrebiaturaUnidadMedida } from 'src/app/utils/unidad-medida.utils';

@Component({
  selector: 'app-alimentos-list',
  templateUrl: './alimentos-list.component.html',
  styleUrls: ['./alimentos-list.component.scss'],
})
export class AlimentosListComponent  implements OnInit {

  listaResultados: Alimento[] = [];

  categoria: string = '';
  idDiario: string = '';
  textoBusqueda: string = '';
  resultados: number = 10;
  noResultsFound: boolean = false;
  segmentActual: string = 'mis-alimentos';

  constructor(private diariosService: DiariosService,
    private alimentosService: AlimentosService,
    private toastService: ToastService,
    private router: Router,
    private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.categoria = this.diariosService.categoriaActual;
    this.idDiario = this.diariosService.idDiarioActual;
  }

  onSearchbarChange(event) {
    this.textoBusqueda = event.detail.value;
    this.cargarAlimentos();
  }

  onSegmentChange(event) {
    this.segmentActual = event.detail.value;
    this.cargarAlimentos();
  }

  cargarAlimentos() {
    this.noResultsFound = false;
    this.listaResultados = [];
    if(this.textoBusqueda.trim() !== '') {
      if(this.segmentActual === 'mis-alimentos') {
        this.alimentosService.cargarAlimentosPorUsuario(this.resultados, this.textoBusqueda).subscribe(res => {
          this.listaResultados = res['alimentos'];
          this.comprobarSiHayResultados();
        }, (err) => {
          const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
          this.toastService.presentToast(msg, 'danger');
        });
      } else {
        this.alimentosService.cargarAlimentosOpenFoodFacts(this.resultados, this.textoBusqueda).subscribe(res => {
          this.filterAlimentosData(res['searchResults']);
          this.comprobarSiHayResultados();
        }, (err) => {
          const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
          this.toastService.presentToast(msg, 'danger');
        });
      }
    }
  }

  filterAlimentosData(searchResults: any[]) {
    let index = 0;
    searchResults.forEach(result => {
      const nutrientes = result.nutriments;
      const alimento = new Alimento(index.toString(), result.product_name, result.brands, 100, 'gramos', nutrientes['energy-kcal_100g'],
        nutrientes['carbohydrates_100g'], nutrientes['proteins_100g'], nutrientes['fat_100g'], this.usuariosService.uid);
      this.listaResultados.push(alimento);
      index++;
    })
  }

  getSubtituloAlimento(alimento: Alimento): string {
    let subtitulo = alimento.marca != null ? alimento.marca : '';
    const cantidadConUnidad = `${alimento.cantidadReferencia} ${getAbrebiaturaUnidadMedida(alimento.unidadMedida)}`;
    subtitulo += alimento.marca != null ? ` (${cantidadConUnidad})` : `${cantidadConUnidad}`;
    return subtitulo;
  }

  comprobarSiHayResultados() {
    if(this.listaResultados.length == 0) {
      this.noResultsFound = true;
    } else {
      this.noResultsFound = false;
    }
  }

  registrarAlimentoConsumido(alimento: Alimento) {
    if(this.segmentActual === 'mis-alimentos') {
      this.goToRegistroAlimento(alimento.uid);
    } else {
      this.alimentosService.createAlimento(alimento).subscribe(res => {
        this.goToRegistroAlimento(res['alimento'].uid);
      });
    }
  }

  goToRegistroAlimento(idAlimento: string) {
    this.diariosService.idAlimentoActual = idAlimento;
    this.router.navigateByUrl('/alimentos/registro');
  }

}
