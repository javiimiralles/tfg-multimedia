import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Diario } from '../models/diario.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class DiariosService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService, private toastService: ToastService) {}

  cargarDiarioPorFecha(fecha: Date): Observable<any> {
    const fechaFormateada = this.formatDate(fecha);
    return this.http.get(`${environment.base_url}/diarios/usuario/${this.idUsuario}?fecha=${fechaFormateada}`, this.headers);
  }

  crearDiario(date: Date): Observable<any> {
    const data: FormData = new FormData;
    data.append('idUsuario', this.idUsuario);
    data.append('fecha', date.toISOString());
    return this.http.post(`${environment.base_url}/diarios`, data, this.headers);
  }

  deleteAlimentoConsumido(uid: string, index: number): Observable<any> {
    const alimentoEliminar = { index };
    const data: FormData = new FormData;
    data.append('alimentoEliminar', JSON.stringify(alimentoEliminar));
    data.append('idUsuario', this.idUsuario);
    return this.http.put(`${environment.base_url}/diarios/alimentos-consumidos/${uid}`, data, this.headers);
  }

  private formatDate(date: Date) {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = '' + date.getFullYear();

    if(month.length < 2) {
      month = '0' + month;
    }
    if(day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
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
