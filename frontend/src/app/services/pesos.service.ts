import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { formatDate } from '../utils/date.utils';
import { RegistroPeso } from '../models/registro-peso.model';

@Injectable({
  providedIn: 'root'
})
export class PesosService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) { }

  cargarRegistrosPesoPorFechas(fechaDesde: Date, fechaHasta: Date) {
    const fecDesdeFormateada = formatDate(fechaDesde);
    const fecHastaFormateada = formatDate(fechaHasta);
    return this.http.get(`${environment.base_url}/registros-peso/usuario/${this.idUsuario}?fechaDesde=${fecDesdeFormateada}&fechaHasta=${fecHastaFormateada}`, this.headers);
  }

  createRegistroPeso(registro: RegistroPeso) {
    const data: FormData = new FormData;
    data.append('fecha', registro.fecha.toISOString());
    data.append('peso', registro.peso.toString());
    data.append('idUsuario', this.idUsuario);
    return this.http.post(`${environment.base_url}/registros-peso`, data, this.headers);
  }

  updateRegistroPeso(registro: RegistroPeso) {
    const uid = registro.uid;
    const data: FormData = new FormData;
    data.append('fecha', registro.fecha.toISOString());
    data.append('peso', registro.peso.toString());
    data.append('idUsuario', this.idUsuario);
    return this.http.put(`${environment.base_url}/registros-peso/${uid}`, data, this.headers);
  }

  deleteRegistroPeso(uid: string) {
    return this.http.delete(`${environment.base_url}/registros-peso/${uid}`, this.headers);
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
