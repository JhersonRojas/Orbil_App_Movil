import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatoElemento, Peticion_Interface } from '../interface/interface';

@Injectable({ providedIn: 'root' })

// <-- Esta clase contiene los servicios con los metodos para comunicarse con el servidor -->
export class ProyectorService {

  MyUrl = environment.url
  token = localStorage.getItem('token')

  // <-- El contructor llama los parametros importados desde otros componentes -->
  constructor(private http: HttpClient) { } // <-- En este caso esta obteniendo los metodos Http para realizar consultas "http"

  // <-- Función que obtiene los proyectores desde el servidor -->
  Listar_Proyectores_Service() {
    let headers = new HttpHeaders({ "token": this.token });
    return this.http.get<Peticion_Interface>(this.MyUrl + '/proyectores', { headers: headers }) // <- Aqui se añade la ruta especifica
  }

  // <-- Función que envía los datos recibidos desde el modulo de proyector y los envía al servidor -->
  Reservar_Proyector_Service(data: string) {
    let headers = new HttpHeaders({ "token": this.token });
    return this.http.post<Peticion_Interface>(this.MyUrl + '/movimientos/reserva/proyector', data, { headers }) // <- Aqui se añade la ruta especifica
  }

}