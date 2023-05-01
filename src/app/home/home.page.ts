import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CheckTokenService } from '../middlewares/check-token.service';

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

  // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private valideAccess: CheckTokenService,
    private NgMenu: MenuController
  ) {
    this.NgMenu.enable(true); // <-- Bloqueo del menú desplegable en esta vista -->
  }

  // <-- Funció de angular, su contenido es lo primero que se ejecuta al entrar a esta vista -->
  ngOnInit() { 
    setTimeout(() => {
      this.saveDataUser(); // <-- validacion de la existencia del token -->
    }, 500);
  }

  private saveDataUser() {
    this.valideAccess.checkToken().then(permiso => {
      if (permiso) {
        this.identificacion = localStorage.getItem('identificacion');
        this.rol = localStorage.getItem('tipo_usuario');
        this.usuario = localStorage.getItem('usuario').split(' ', 1)[0];
        if (this.rol == 'Instructor' || this.rol == 'Administrador' || this.rol == 'Administrativo')
          this.permiso_de_rango = true
      }
    })
  }
}
