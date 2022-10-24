import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Listar_Proyectores_Interface, Reserva_Ambiente_Interface } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})

    // <------------- Esta clase contiene los servicios con los metodos para comunicarse con el Api Rest ----------------->
export class ProyectorService {

    // <----------------- "url" es la variable de la ruta que se obtiene desde enviroments ------------------->
  url = environment.url

      // <----------------- La función del contructor llama los parametros importados desde otros componentes ------------------->
    // <----------------- En este caso esta obteniendo los metodos Http para realizar las consultas ------------------->
  constructor( private http: HttpClient) {}

    // <----------------- Función que envía los datos recibidos desde el modulo de proyector y los envía al Api Rest ------------------->
  Reservar_Proyector_Service(data: string){
    return this.http.post<Reserva_Ambiente_Interface>( this.url + '/proyector/reservar', data) // <- Aqui se añade la ruta especifica
  }

    // <----------------- Función que obtiene los proyectores desde el Api Rest ------------------->
  Listar_Proyectores_Service(){
    return this.http.get<Listar_Proyectores_Interface>(this.url +'/proyectores') // <- Aqui se añade la ruta especifica
  }

}
