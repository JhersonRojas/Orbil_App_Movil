import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';

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
      // <--------- "NgRouter" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden ----------->
    private NgRouter: Router,
    private NgAlert: AlertController,
    private NgMenu: MenuController,
  ) { this.NgMenu.enable(true); } // <-- Bloqueo del menú desplegable en esta vista -->

    // <----------------- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista ------------------->
  ngOnInit() {
    // <----------------- "return" llama a la función de "validarDatos" ------------------->
  return this.ValidarDatos(); 
  }


    // <----------- Esta función confirma si los datos del usuario son validos, de no, lo regresara al login ------------->
  async ValidarDatos(){
    try { 
      let token = localStorage.getItem('token')
      if (token){
        this.rol = localStorage.getItem('tipo_usuario')
        this.usuario = localStorage.getItem('usuario').split(' ', 1)[0]
        this.identificacion = localStorage.getItem('identificacion')

          if(this.rol == "Instructor" || this.rol == "Administrativo") 
            {this.permiso = true } else { this.permiso = false}

      } else {this.NgRouter.navigate(['/login'])}
    } catch (error){}
  }

  async logout() {
    const alert = await this.NgAlert.create({
      header: `Desea cerrar sesión?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
    const confirm = await alert.onDidDismiss();

    if ( confirm.role == 'confirm') {
      const close = async () => {
        localStorage.clear()
        this.NgRouter.navigate(['/login'])
        await location.reload()
      }
      return close();
    }

  }


}
