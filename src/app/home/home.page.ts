import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

// <-- Esta clase contiene las funciones y variables del modulo de proyector -->
export class HomePage implements OnInit {

  permiso: boolean = false

  // <-- Estas variables son aquellas que tomaran los datos del usuarios guardados en el localstorage -->
  rol: string
  usuario: string
  identificacion: string

  // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private NgRouter: Router,// <-- "NgRouter" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->
    private NgMenu: MenuController,
  ) {
    this.checkToken(); // <-- validacion de la existencia del token -->
    this.NgMenu.enable(true); // <-- Bloqueo del menú desplegable en esta vista -->
  }

  // <-- Funció de angular, su contenido es lo primero que se ejecuta al entrar a esta vista -->
  ngOnInit() { }

  // <-- Esta función confirma si los datos del usuario son validos, de no, lo regresara al login -->
  async checkToken() {
    try {
      let token = localStorage.getItem('token')
      if (!token) return this.NgRouter.navigate(['/login'])

      this.rol = localStorage.getItem('tipo_usuario')
      this.usuario = localStorage.getItem('usuario').split(' ', 1)[0]
      this.identificacion = localStorage.getItem('identificacion')

      if (this.rol == "Instructor" || this.rol == "Administrativo" || this.rol == "Administrador") return this.permiso = true
      else return this.permiso = false

    } catch (error) {
      console.log('error :>> ', error);
    }
  }

}