import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Exhibicion_Computador_Interface, Reservar_Computador_Interface } from '../interface/interface'

@Injectable({
  providedIn: 'root'
})

// <----------------- Esta clase contiene los servicios con los metodos para comunicarse con el Api Rest ------------------->
export class ComputadoresService {

  // <----------------- "url" es la variable de la ruta que se obtiene desde enviroments ------------------->
  url = environment.url
  token = localStorage.getItem('token')
  headers = new HttpHeaders({ "token": this.token });

  // <----------------- La función del contructor llama los parametros importados desde otros componentes ------------------->
  // <----------------- En este caso esta obteniendo los metodos Http para realizar las consultas ------------------->
  constructor(private http: HttpClient) { }

  Cantidad_Computador_Service() {
    return this.http.get<Exhibicion_Computador_Interface>(this.url + '/computadores/disponibles', { headers: this.headers});
  }

  // <----------------- Función que envia los datos para la reserva de un computador al Api Rest ------------------->
  Reservar_Computador_Service(data: string) {
    let headers = new HttpHeaders({ "token": this.token });
    return this.http.post<Reservar_Computador_Interface>(this.url + '/movimientos/reserva/computador', data, { headers })
  }

}
