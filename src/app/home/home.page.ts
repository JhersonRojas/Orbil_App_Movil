import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

    // <----------------- Esta clase contiene las funciones y variables del modulo de proyector ------------------->
export class HomePage implements OnInit {

  permiso: boolean = false 

    // <------ Estas variables son aquellas que tomaran los datos del usuarios guardados en el localstorage ----------->
  rol: string  
  usuario:string 
  identificacion: string 

    // <----------------- El constructor obtiene los parametros importados de diferentes componentes ------------------->
  constructor(
      // <--------- "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden ----------->
    private route: Router,
      // <---------- "menu" me permite controlar el comportamiento del menú desplegable ----------------------> 
    private menuCtrl :MenuController) { }

    // <----------------- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista ------------------->
  ngOnInit() {
    // <--------------------- Este segmento habilita el menú desplegalbe en la aplicación ----------------------------------->
  this.menuCtrl.enable(true);
    
    // <----------------- "return" llama a la función de "validarDatos" ------------------->
  return this.ValidarDatos(); 
  }

    // <----------- Esta función confirma si los datos del usuario son validos, de no, lo regresara al login ------------->
  async ValidarDatos(){
    try { 
      let token = localStorage.getItem('token')
      if (token){
        this.rol = localStorage.getItem('tipo_usuario')
        this.usuario = localStorage.getItem('usuario')
        this.identificacion = localStorage.getItem('identificacion')

          if(this.rol == "Instructor" || this.rol == "Administrativo") 
            {this.permiso = true } else { this.permiso = false}

      } else {this.route.navigate(['/login'])}
    } catch (error){}
  }

}
