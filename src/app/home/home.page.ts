import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CheckTokenService } from '../middlewares/check-token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

// Esta clase contiene las funciones y variables del modulo de proyector
export class HomePage implements OnInit {

  // Estas variables son aquellas que tomaran los datos del usuarios guardados en el localstorage
  identificacion: string;
  usuario: string;
  rol: string;
  permiso_de_rango: boolean;

  // El constructor obtiene los parametros importados de diferentes componentes
  constructor(
    private valideAccess: CheckTokenService, // Servicio para verificar la vigencia de la sesión del usuario
    private NgRouter: Router, // Modulo para redirigir a otras rutas
    private NgMenu: MenuController, // Modulo para controlar el sideBar
  ) {
    this.NgMenu.enable(true); // Bloqueo del menú desplegable en esta vista
  }
  
  // Funció de angular, su contenido es lo primero que se ejecuta al entrar a esta vista
  ngOnInit() {
    this.confirmUser()  
  }

  // Metodo para validar la sesión del usuario
  private confirmUser = () => {
    this.valideAccess.checkToken().subscribe(resp => {
      if (resp.confirm == true ) {
        this.identificacion = this.valideAccess.setDataUser().identificacion
        this.usuario = this.valideAccess.setDataUser().usuario.split(' ')[0]
        this.rol = this.valideAccess.setDataUser().tipo_usuario
        
        this.rol == 'Administrador' || this.rol == 'Administrativo' || this.rol == 'Instructor' ? 
          this.permiso_de_rango = true : this.permiso_de_rango = false
      }
    }, error => {
      if (error) {
        localStorage.clear()
        this.NgMenu.enable(false)
        setTimeout(() => this.NgRouter.navigate(['login']), 500);
      }
    })
  }
}
