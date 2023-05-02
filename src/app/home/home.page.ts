import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CheckTokenService } from '../middlewares/check-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

// <-- Esta clase contiene las funciones y variables del modulo de proyector -->
export class HomePage implements OnInit {

  // <-- Estas variables son aquellas que tomaran los datos del usuarios guardados en el localstorage -->
  rol: string;
  usuario: string;
  identificacion: string;
  permiso_de_rango: boolean;
  token: string;

  // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private valideAccess: CheckTokenService,
    private NgMenu: MenuController,
    private NgRouter: Router,
  ) {
    this.NgMenu.enable(true); // <-- Bloqueo del menú desplegable en esta vista -->
  }
  
  // <-- Funció de angular, su contenido es lo primero que se ejecuta al entrar a esta vista -->
  ngOnInit() {
    this.saveDataUser()
  }

  private saveDataUser () {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      this.NgMenu.enable(false)
      localStorage.clear()
      setTimeout(() => {
        this.NgRouter.navigate(['/login']);
      }, 500);
    }
    else {
      this.valideAccess.checkToken(this.token).subscribe(resp => {
        if (resp.confirm) {
          this.identificacion = localStorage.getItem('identificacion');
          this.rol = localStorage.getItem('tipo_usuario');
          this.usuario = localStorage.getItem('usuario').split(' ', 1)[0];
          if (this.rol == 'Instructor' || this.rol == 'Administrador' || this.rol == 'Administrativo')
            this.permiso_de_rango = true
        }
      }, error => {
        if (error.error.confirm === false) {
          this.NgMenu.enable(false)
          localStorage.clear()
          setTimeout(() => {
            this.NgRouter.navigate(['/login'], {skipLocationChange: true});
          }, 500);
        }
      });
    }
  }
}
