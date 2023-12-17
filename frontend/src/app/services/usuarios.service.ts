import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuario: Usuario;

  constructor(private http: HttpClient, private router: Router) { }

  login(formData: any): Observable<any> {
    return this.http.post(`${environment.base_url}/login`, formData)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res['token'] as string);
          const { uid } = res;
          this.usuario = new Usuario(uid);
        })
      );
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {

    if (this.token === '') {
      this.cleanLocalStorage();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap((res: any) => {
          const { token, uid, nombre, email, sexo, altura, edad, pesoInicial, pesoHistorico, plan, distribucionComidas, configuracion } = res;
          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, nombre, email, null, sexo, altura, edad, pesoInicial, pesoHistorico,
            plan, distribucionComidas, configuracion);
        }),
        map (res => {
          return correcto;
        }),
        catchError (err => {
          this.cleanLocalStorage();
          return of(incorrecto);
        })
      );
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }

  cleanLocalStorage(): void{
    localStorage.removeItem('token');
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid;
  }

  get nombre(): string{
    return this.usuario.nombre;
  }

  get email(): string{
    return this.usuario.email;
  }

  get sexo(): string{
    return this.usuario.sexo;
  }

  get altura(): number{
    return this.usuario.altura;
  }

  get edad(): number{
    return this.usuario.edad;
  }

  get pesoInicial(): number{
    return this.usuario.pesoInicial;
  }

  get pesoHistorico() {
    return this.usuario.pesoHistorico;
  }

  get plan() {
    return this.usuario.plan;
  }

  get distribucionComidas(): string[] {
    return this.usuario.distribucionComidas;
  }

  get configuracion() {
    return this.usuario.configuracion;
  }
}