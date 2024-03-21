import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { getHeaders } from '../utils/headers.utils';
import { formatDate } from '../utils/date.utils';
@Injectable({
  providedIn: 'root'
})
export class Modelos3DService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  getUrlModelos3DByUser() {
    return this.http.get(`${environment.base_url}/modelos3D/usuario/${this.idUsuario}`, getHeaders());
  }


}
