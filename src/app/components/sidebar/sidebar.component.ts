import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  rol: any 
  usuario: any
  identificacion: any 
    permiso: boolean

  constructor( 
    private NgRouter: Router, 
    ) {}

  ngOnInit(){
    this.verify();
  }

  async verify(){
    try {
      let token = localStorage.getItem('token')
      if (token){
        this.rol = localStorage.getItem('tipo_usuario')
        this.usuario = localStorage.getItem('usuario')
        this.identificacion = localStorage.getItem('identificacion')

        if(this.rol == "Instructor" || this.rol == "Administrativo") { 
          this.permiso = true 
          } else { 
            this.permiso = false
          }

      } else {this.NgRouter.navigate(['/login'])}
    } catch (error){}
  }

  otherPage(elemento: string) {
    this.NgRouter.navigate([elemento])
 }

  async logout(){
    localStorage.clear()
    this.NgRouter.navigate(['/login'])
    await location.reload()
  }

}