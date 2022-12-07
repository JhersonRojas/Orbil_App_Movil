import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login_Interface } from '../interface/interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

  // <------------- Esta clase contiene los servicios con los metodos para comunicarse con el Api Rest ----------------->
export class LoginService {

    // <----------------- "url" es la variable de la ruta que se obtiene desde enviroments ------------------->
  url = environment.url

      // <----------------- La función del contructor llama los parametros importados desde otros componentes ----------->
    // <----------------- En este caso esta obteniendo los metodos Http para realizar las consultas ------------------->
  constructor( private http: HttpClient) {}

    // <----------------- Función que envía los datos de acceso para ser validados en el Api Rest --------------------->
  Login_Service(data: string){
    return this.http.post<Login_Interface>( this.url + '/usuarios/auth/login', data) // <- Aqui se añade la ruta especifica
  }
  
}