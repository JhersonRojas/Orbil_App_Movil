import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  rol: any 
  usuario: any
  identificacion: any 
    permiso: boolean

  constructor( private route: Router, private menu: MenuController) {}


  ngOnInit(){
    this.entrada()
  }

  async entrada(){
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

  async logout(){
    localStorage.clear()
    this.route.navigate(['/login'])
    await location.reload()
  }

}