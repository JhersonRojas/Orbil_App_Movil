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
  url = environment.url;
  token: string;
  estado: any

  constructor(
    private http: HttpClient,
    private NgMenu: MenuController /* "NgMenu" me permite controlar el manejo del menú desplegable, como mostrarlo o no */,
    private NgRouter: Router // < "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden
  ) { }

  // función para la valizacion del acceso a el App
  public checkToken = async () => {
    this.token = localStorage.getItem('token');
    if (!this.token) return this.NgRouter.navigate(['/login']);
    const headers = new HttpHeaders({ token: this.token });

    this.http.get<Login_Interface>(this.url + '/usuarios/access/valide', { headers: headers }).subscribe(
      resp => {        
        return resp.confirm ? this.estado = resp : this.estado = false
      },
      error => {
        this.estado = false
        localStorage.clear()
        this.NgMenu.enable(false);
        this.NgRouter.navigate(['/login']);
      }
    )
    return await this.estado
  }
}
