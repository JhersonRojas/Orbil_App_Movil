import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Listar_Proyectores_Interface, Reserva_Ambiente_Interface } from '../interface/interface';

@Injectable({ providedIn: 'root' })

    // <-- Esta clase contiene los servicios con los metodos para comunicarse con el servidor -->
export class ProyectorService {

  MyUrl = environment.url

    // <-- El contructor llama los parametros importados desde otros componentes -->
  constructor( private http: HttpClient ) {} // <-- En este caso esta obteniendo los metodos Http para realizar consultas "http"

    // <-- Función que obtiene los proyectores desde el servidor -->
  Listar_Proyectores_Service(){
    return this.http.get<Listar_Proyectores_Interface>(this.MyUrl +'/proyectores') // <- Aqui se añade la ruta especifica
  }

  // <-- Función que envía los datos recibidos desde el modulo de proyector y los envía al servidor -->
  Reservar_Proyector_Service(data: string): Observable<Reserva_Ambiente_Interface>{
    return this.http.post<Reserva_Ambiente_Interface>( this.MyUrl + '/movimientos/reserva/proyector', data) // <- Aqui se añade la ruta especifica
      .pipe(catchError(this.handleError<Reserva_Ambiente_Interface>('Reserva_Ambiente_Interface')))
  }

    // <-- Si ocurre un error para conectarse con el servidor, esta función se activara y lo indicara -->
  private handleError<T>( operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {     
        // Let the app keep running by returning an empty result.
        console.log('error :>> ', error.message);
        return of(result as T);
      };
   }
}