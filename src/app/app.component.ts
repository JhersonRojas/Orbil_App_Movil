import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController } from '@ionic/angular'
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit, AfterViewInit{

  rol: any 
  usuario: any
  identificacion: any 
    permiso: boolean

  selected: any
    other: any

  public subscriber: Subscription;

  constructor( 
    private route: Router,
    private NgAlert: AlertController,
    private router: Router, 
  ) {}


  ngOnInit(){
    this.selected ='1'
    this.entrada()
  }

  ngAfterViewInit(): void {
    this.selectPage()
  }

  async selectPage() {
    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(async (event) => {
       //console.log('The URL changed to: ' + event['url'].split('/')[1])
       const pages = {
        "home":       "1",         
        "lista":      "2",
        "detalle":    "2",
        "computador": "3",
        "proyector":  "4",
        "ambiente":   "5",
        "permisos":   "6",       
        "historial":  "7",   
        "manual":  "8",   
      }
    await pages[event['url'].split('/')[1]] ?? console.log('No se reconocio esta pagina');
    this.other = pages[event['url'].split('/')[1]];

    return this.selectList()

    });
  }

  async selectList(e = null){
    try {
      let select: any = document.getElementById(this.selected)
      select.setAttribute('style', 'color: rgb(85, 85, 85); border-left: 0' )

      if ( e == null ) {
        this.selected = this.other
        select = document.getElementById(this.selected)
        return select.setAttribute('style', 'color: #39A100; border-left: 5px solid green' )
      }
  
      this.selected = e.srcElement.attributes.id.value || this.other
      select = document.getElementById(this.selected)
      return select.setAttribute('style', 'color: #39A100; border-left: 5px solid green' )
      
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
  
  async entrada(){
    try {

      let token = localStorage.getItem('token')
      if (!token) this.route.navigate(['/login'])

      this.rol = localStorage.getItem('tipo_usuario')
      this.usuario = localStorage.getItem('usuario')
      this.identificacion = localStorage.getItem('identificacion')

      if(this.rol == "Instructor" || this.rol == "Administrativo") 
        {this.permiso = true } else { this.permiso = false}

    } catch (error){}
  }

  async logout() {
    const alert = await this.NgAlert.create({
      header: `Desea cerrar sesión?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
    const confirm = await alert.onDidDismiss();

    if ( confirm.role == 'confirm') {
      const close = async () => {
        localStorage.clear()
        this.route.navigate(['/login'])
        await location.reload()
      }
      return close();
    }

  }

}