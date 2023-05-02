import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Login_Interface } from '../interface/interface';

@Injectable({
  providedIn: 'root',
})

export class CheckTokenService {
  url = environment.url;
  token: string;

  constructor(
    private http: HttpClient,
    private NgRouter: Router // < "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden
  ) { }

  // función para la valizacion del acceso a el App
  checkToken(token: any) {    
    const headers = new HttpHeaders({ token: token });
    if (token)
      return this.http.get<Login_Interface>(this.url + '/usuarios/access/valide', { headers: headers })
    else
      localStorage.clear()
      this.NgRouter.navigate(['/login'], {skipLocationChange: true});
  }
}
