import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login_Interface } from '../interface/interface';
import { environment } from '../../environments/environment'; // Llamado a las variables globales

@Injectable({ providedIn: 'root' })

// <-- Clase que contiene los servicios con los metodos para comunicarse con servidor -->
export class LoginService {

  MyUrl = environment.url // <-- "MyUrl", variable de la ruta que se obtiene desde enviroments -->

  // <-- El contructor llama los parametros importados desde otros componentes -->
  constructor(private http: HttpClient) { } // <-- En este caso esta obteniendo los metodos Http para realizar consultas "http"

  // <-- Función que envía los datos de acceso para ser validados en el servidor -->
  public Login_Service(data: string): Observable<Login_Interface> {
    return this.http.post<Login_Interface>(this.MyUrl + '/usuarios/test/login', data) // <- Aqui se añade la ruta especifica
      .pipe(catchError(this.handleError<Login_Interface>('Login_Service')))
  }

  // <-- Si ocurre un error para conectarse con el servidor, esta función se activara y lo indicara -->
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      console.log('error :>> ', error.message);
      return of(result as T);
    };
  }
}