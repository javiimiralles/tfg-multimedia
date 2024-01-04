import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { Alimento } from '../models/alimento.model';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarAlimentoPorId(uid: string) {
    return this.http.get(`${environment.base_url}/alimentos/${uid}`, this.headers);
  }

  cargarAlimentosPorUsuario(resultados: number, textoBusqueda: string) {
    return this.http.get(`${environment.base_url}/alimentos/usuario/${this.idUsuario}?resultados=${resultados}&texto=${textoBusqueda}`, this.headers);
  }

  cargarAlimentosOpenFoodFacts(resultados: number, textoBusqueda: string) {
    return this.http.get(`${environment.base_url}/open-food-facts/search?query=${textoBusqueda}&resultados=${resultados}`, this.headers);
  }

  createAlimento(alimento: Alimento) {
    const data: FormData = this.getFormData(alimento);
    return this.http.post(`${environment.base_url}/alimentos`, data, this.headers);
  }

  updateAlimento(uid: string, alimento: Alimento) {
    const data: FormData = this.getFormData(alimento);
    return this.http.put(`${environment.base_url}/alimentos/${uid}`, data, this.headers);
  }

  private getFormData(alimento: Alimento): FormData {
    const data: FormData = new FormData;
    data.append('nombre', alimento.nombre);
    if(alimento.marca != null && alimento.marca !== '') {
      data.append('marca', alimento.marca);
    }
    data.append('cantidadReferencia', (alimento.cantidadReferencia).toString());
    data.append('unidadMedida', alimento.unidadMedida);
    data.append('calorias', (alimento.calorias).toString());
    data.append('carbohidratos', (alimento.carbohidratos).toString());
    data.append('proteinas', (alimento.proteinas).toString());
    data.append('grasas', (alimento.grasas).toString());
    data.append('idUsuario', this.idUsuario);

    return data;
  }

  get headers(){
    return {
      headers:{
        'x-token': this.token
      }
    }
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
}
