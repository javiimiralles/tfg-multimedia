import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarAlimentosPorUsuario(resultados: number, textoBusqueda: string) {
    return this.http.get(`${environment.base_url}/alimentos/usuario/${this.idUsuario}?resultados=${resultados}&texto=${textoBusqueda}`, this.headers);
  }

  cargarAlimentosOpenFoodFacts(resultados: number, textoBusqueda: string) {
    return this.http.get(`${environment.base_url}/open-food-facts/search?query=${textoBusqueda}&resultados=${resultados}`, this.headers);
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
