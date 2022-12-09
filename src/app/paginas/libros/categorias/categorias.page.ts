import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { librosService } from '../../../services/libros.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})

  // <------------------ Esta clase contiene las funciuones  y variables del modulo de categorias ---------->
export class CategoriasPage implements OnInit {

     // <----------------- "form" es la variable que guarda los datos recibidos de "Fb" desde el HTML ------------------->
  form: FormGroup;

  cargo: any;
  usuario: any;
  identificacion: any

    // <------------------------- Esta variable almacena los datos obtenidos de la consulta al Api Rest----------------------------->
  categorias: any

  constructor(
    // <----------------- "service" obtiene los servicios proporcionados desde libros service ------------------->
    private service: librosService,
    private NgRouter: Router
    ) { }

      // <----------------- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista ------------------->
  ngOnInit() {

    this.ValidarDatos();
      // <------------------------- Esta sección obtiene las categorias del Api Rest por medio del servicio --------------------------->
    this.service.Listar_Categorias_Service().subscribe(
      resp => {
          this.categorias = resp
      });
  }

  async ValidarDatos(){
    try { 
      let token = localStorage.getItem('token')
      if (token){
        this.cargo = localStorage.getItem('tipo_usuario')
        this.usuario = localStorage.getItem('usuario')
        this.identificacion = localStorage.getItem('identificacion')


      } else {this.NgRouter.navigate(['/login'])}
    } catch (error){}
  }

}
