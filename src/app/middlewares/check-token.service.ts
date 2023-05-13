import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Login_Interface } from '../interface/interface';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})

export class CheckTokenService {

  token!: string;

  constructor(
    private http: HttpClient, // modulo para hacer peticiones http
    private NgMenu: MenuController, // modulo para activar el side menu
    private NgRouter: Router // router es una función que me permite redirigir al usuario a otra ruta
  ) { }
  
  // función para la valizacion del acceso a el App
  public checkToken = () => {
    localStorage.getItem('token') ? this.token = localStorage.getItem('token') : this.token = undefined;
    
    if (this.token) {
      const headers = new HttpHeaders({ token: this.token });
      return this.http.get<Login_Interface>( environment.url + '/usuarios/access/valide', { headers: headers })
    } 

    if (!this.token) {
      localStorage.clear()
      this.NgMenu.enable(false)
      setTimeout(() => this.NgRouter.navigate(['login']), 500);
      return this.http.get<Login_Interface>( environment.url + '/usuarios/access/valide')
    }
  }

  public setDataUser = () => {
    const dataUser = {
      identificacion: localStorage.getItem('identificacion'),
      usuario: localStorage.getItem('usuario'),
      tipo_usuario: localStorage.getItem('tipo_usuario'),
      token: localStorage.getItem('token'),
    }
    return dataUser
  }
}
