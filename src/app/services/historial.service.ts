import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Historial_Interface } from '../interface/interface';


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
    return this.http.get<Historial_Interface>(this.url + `/usuarios/historial/${id}`, { headers: headers });
  }

}
