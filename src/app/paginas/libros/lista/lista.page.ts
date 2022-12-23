import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dato } from 'src/app/interface/interface';
import { librosService } from 'src/app/services/libros.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})

  // <-- Esta clase contiene las distintas funciones y variables del modulo de la lista de los libros -->
export class ListaPage implements OnInit {

    // <-- Estas son las variables que almacenan la información obtenida del la categoria previamente elegida -->
  libros:    Dato[] = [];
    titulo_cat:   string;
    searchLibros:    any; 
    setLibro: any;
    serial: string
  
    // <-- Aqui se almacena el mensaje del Api Rest dependiendode su respuesta -->
  respuesta:         any;
    aviso:           any; 
  
    // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private service:  librosService, // <-- "service" obtiene los servicios proporcionados desde proyectores service -->
    private NgRouter: ActivatedRoute) {} // <-- "NgRouter", función de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->

      // <-- Es una función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista -->
  ngOnInit() {
    // <-- Esta sección llama los datos del Api Rest tomando en cuenta la categoria elegida -->
    let idc = this.NgRouter.snapshot.paramMap.get('idc');
    this.listar_libros(idc);
  }

  listar_libros(idc: any){
    this.service.Listar_Libros_Service(idc).subscribe( resp => {
      this.respuesta = resp
      this.libros = this.respuesta.datos;
      this.searchLibros = this.libros;

        // <------- Esta condicional valida si se obtuvieron datos de la categoria elegida ------->
          if (resp.confirm == false ){
            this.aviso = "false"
            this.titulo_cat = "😒" 
          } else { 
            this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria  
          }
        console.log(resp.datos)
      });
  }

    // <------- Esta función se encarga de filtrar los datos para dar como respuesta una coincidencia de la información obtenida -------------------->
  searchCustomer(event){
    const text = event.target.value;
    this.searchLibros = this.libros;

    if ( text && text.trim() != ''){
      this.searchLibros = this.searchLibros.filter((libros)=> {
        return (libros.Nombre_Elemento.toLowerCase().indexOf(text.toLowerCase()) > -1)
      })
    }
  }

  isModalOpen = false;

  openDetailBook(isOpen: boolean, idl: string = 'nothing') {
    this.isModalOpen = isOpen;

    this.service.Listar_Un_Libro(idl).subscribe( resp => {
      this.setLibro = resp
      console.log(resp)
      
    })

  }

}