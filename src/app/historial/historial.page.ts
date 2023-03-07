import { Component, OnInit } from '@angular/core';
import { HistorialService } from '../services/historial.service';
import { Elemento2 } from '../interface/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  respuesta: any
  elementos: Elemento2[] = []
  identificacion: string;

  constructor(
    private service: HistorialService,
    private NgRouter: Router
    ) {
    this.checkToken()
  }

  ngOnInit() {
    this.list_History();
  }
  async checkToken(){
    try {
      let token = localStorage.getItem('token')
      if (!token) return this.NgRouter.navigate(['/login'])
      this.identificacion = localStorage.getItem('identificacion')

    } catch (error){
      console.log('error :>> \n ', error);
    }
  }

  async list_History(){
    try {
      let token =  localStorage.getItem('token');

      this.service.History_Service(token, this.identificacion).subscribe( resp => {
        this.respuesta = resp
        this.elementos = (resp.elemento)

      setTimeout(() => { 
        let clasifique = document.querySelectorAll('.estado')
        
        for (let i = 0; i < clasifique.length; i++) {
          if ( clasifique[i].firstChild.textContent == "Solicitud") clasifique[i].setAttribute("style", "color: blue"); 
          if ( clasifique[i].firstChild.textContent == "Prestado")  clasifique[i].setAttribute("style", "color: green"); 
          if ( clasifique[i].firstChild.textContent == "Retornado") clasifique[i].setAttribute("style", "color: gray"); 
          if ( clasifique[i].firstChild.textContent == "Cancelado") clasifique[i].setAttribute("style", "color: red");
        }
      }, 50)
        return console.log('resp :>> ', this.elementos)
      })
    
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
}