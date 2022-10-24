import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

    // <------------------------- Esta variable almacena los datos obtenidos de la consulta al Api Rest----------------------------->
  categorias: any

  constructor(
    // <----------------- "service" obtiene los servicios proporcionados desde libros service ------------------->
    private service: librosService ) { }

      // <----------------- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista ------------------->
  ngOnInit() {
      // <------------------------- Esta sección obtiene las categorias del Api Rest por medio del servicio --------------------------->
    this.service.Listar_Categorias_Service().subscribe(
      resp => {
          this.categorias = resp
      });
  }

}
