import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Peticion_Interface } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})

// <----------------- Esta clase contiene los servicios con los metodos para comunicarse con el Api Rest ------------------->
export class librosService {

  // <----------------- "url" es la variable de la ruta que se obtiene desde enviroments ------------------->
  url = environment.url
  token = localStorage.getItem('token')
  headers = new HttpHeaders({ "token": this.token });

  // <----------------- La función del contructor llama los parametros importados desde otros componentes ------------------->
  // <----------------- En este caso esta obteniendo los metodos Http para realizar las consultas ------------------->
  constructor(private http: HttpClient) { }

  // <----------------- Función que obtiene las categorias de los libros desde el Api Rest ------------------->
  Listar_Categorias_Service() {
    return this.http.get<Peticion_Interface>(this.url + '/categorias', { headers: this.headers }) // <- Aqui se añade la ruta especifica
  }

  // <----------------- Función que obtiene los libros dependiendo de la categoria elegida ------------------->
  Listar_Libros_Service(idc: string) {
    return this.http.get<Peticion_Interface>(this.url + `/libros/categorias/${idc}`, { headers: this.headers }) // <- Aqui se añade la ruta especifica
  }

  // <----------------- Función que obtiene un libro de la lista ------------------->
  Listar_Un_Libro(idl: string) {
    return this.http.get<Peticion_Interface>(this.url + `/libros/serial/${idl}`, { headers: this.headers }) // <- Aqui se añade la ruta especifica
  }

  // <----------------- Función que envia los datos para reservar un libro  ------------------->
  Reservar_Libro(data: string) {
    let headers = new HttpHeaders({ "token": this.token });
    return this.http.post<Peticion_Interface>(this.url + '/movimientos/reserva/libro', data, { headers }) // <- Aqui se añade la ruta especifica
  }
}
