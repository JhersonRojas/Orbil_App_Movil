import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva_Ambiente_Interface } from '../interface/interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

// <----------------- Esta clase contiene los servicios con los metodos para comunicarse con el Api Rest ------------------->
export class AmbienteService {

  // <----------------- "url" es la variable de la ruta que se obtiene desde enviroments ------------------->
  url = environment.url
  token = localStorage.getItem('token')

  // <----------------- La función del contructor llama los parametros importados desde otros componentes ------------------->
  // <----------------- En este caso esta obteniendo los metodos Http para realizar las consultas ------------------->
  constructor(private http: HttpClient) { }

  // <----------------- Función que envía los datos para la reserva del ambiente ------------------->
  Reservar_Ambiente_Service(data: string) {
    let headers = new HttpHeaders({ "token": this.token });
    return this.http.post<Reserva_Ambiente_Interface>(this.url + '/movimientos/reserva/ambiente', data, { headers })
  }

}
