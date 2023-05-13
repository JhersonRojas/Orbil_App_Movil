import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Peticion_Interface } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})

export class HistorialService {

  url = environment.url

  constructor(private http: HttpClient) { }

  public History_Service(token: any, id: any) {
    let headers = new HttpHeaders({
      "token": token
    });
    return this.http.get<Peticion_Interface>(this.url + `/usuarios/historial/${id}`, { headers: headers });
  }

  public cancelReserve(token: any, id: string) {
    let headers = new HttpHeaders({ "token": token });
    return this.http.post<Peticion_Interface>(this.url + '/movimientos/cancelar', { id: id} , {headers})
  }

}
