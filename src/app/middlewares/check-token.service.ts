import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class CheckTokenService {

  token: string;
  permiso: boolean;
  rol: string;

  constructor(
    private NgRouter: Router, // <-- "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->
  ) { }

  // función para la valizacion del acceso a el App
  public async checkToken() {
    try {
      this.token = localStorage.getItem('token');
      if (!this.token) return this.NgRouter.navigate(['/login']);
      if (this.rol == 'Instructor' || this.rol == 'Administrativo' || this.rol == 'Administrador') 
        return (this.permiso = true);
      else 
        return (this.permiso = false);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
}
