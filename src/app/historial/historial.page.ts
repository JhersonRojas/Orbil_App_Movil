import { Component, OnInit } from '@angular/core';
import { HistorialService } from '../services/historial.service';
import { Elemento2 } from '../interface/interface';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  respuesta: any
  elementos: Elemento2[] = []

  constructor( private service: HistorialService) { }

  ngOnInit() {
    this.listar_historial();
  }

  async listar_historial(){
    let token =  localStorage.getItem('token');
    let usuario =  localStorage.getItem('identificacion');

    this.service.History_Service(token, usuario).subscribe( resp => {
      this.respuesta = resp;
      this.elementos = (resp.elemento)
      return console.log('resp :>> ', this.elementos);
    })

  }

}
