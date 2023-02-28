import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva_Ambiente_Interface, Listar_Categorias_Interface, Listar_Libros_Interface, Libro_Unico_Interface } from '../interface/interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

  // <----------------- Esta clase contiene los servicios con los metodos para comunicarse con el Api Rest ------------------->
export class librosService {

    // <----------------- "url" es la variable de la ruta que se obtiene desde enviroments ------------------->
  url = environment.url

      // <----------------- La función del contructor llama los parametros importados desde otros componentes ------------------->
    // <----------------- En este caso esta obteniendo los metodos Http para realizar las consultas ------------------->
  constructor(private http: HttpClient) { }

    // <----------------- Función que obtiene las categorias de los libros desde el Api Rest ------------------->
  Listar_Categorias_Service(){
    return this.http.get<Listar_Categorias_Interface>( this.url + '/categorias') // <- Aqui se añade la ruta especifica
  }

    // <----------------- Función que obtiene los libros dependiendo de la categoria elegida ------------------->
  Listar_Libros_Service(idc:string){
    return this.http.get<Listar_Libros_Interface>( this.url + `/libros/categorias/${idc}`) // <- Aqui se añade la ruta especifica
  }

    // <----------------- Función que obtiene un libro de la lista ------------------->
  Listar_Un_Libro(idl:string){
    return this.http.get<Libro_Unico_Interface>( this.url + `/libros/serial/${idl}`) // <- Aqui se añade la ruta especifica
  }

    // <----------------- Función que envia los datos para reservar un libro  ------------------->
  Reservar_Libro(data: string){
    return this.http.post<Reserva_Ambiente_Interface>( this.url + '/libro/reservar', data) // <- Aqui se añade la ruta especifica
  }

}
