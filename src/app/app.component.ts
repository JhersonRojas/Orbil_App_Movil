import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { CheckTokenService } from './middlewares/check-token.service';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit, AfterViewInit {

  darkMode: boolean = false;
  public subscriber$: Subscription;

  token: any;
  identificacion: any;
  permiso_de_rango: boolean;
  usuario: any;
  rol: any;

  selected: any = '1';
  pages: {} = {
    '/': '1',
    '/login': '1',
    '/home': '1',
    '/lista': '2',
    '/detalle': '2',
    '/computador': '3',
    '/proyector': '4',
    '/ambiente': '5',
    '/permisos': '6',
    '/historial': '7',
    '/manual': '8',
  };

  constructor(
    private valideAccess: CheckTokenService,
    private NgAlert: AlertController,
    private NgRouter: Router,
    private NgActiveRouter: ActivatedRoute, // "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden
    private NgMenu: MenuController /* "NgMenu" me permite controlar el manejo del menú desplegable, como mostrarlo o no */
  ) { }

  ngOnInit() {    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) document.body.classList.toggle('light');
    this.confirmUser()
  }

  ngAfterViewInit(): void {
    this.selectPage();
    setTimeout(() => {
      this.NgActiveRouter.queryParams.subscribe((params: Params) => {  
        this.rol = params['cargo']
        if (this.rol) {
          this.rol == 'Administrador' || this.rol == 'Administrativo' || this.rol == 'Instructor' ?
          this.permiso_de_rango = true : this.permiso_de_rango = false
        }
      })
    }, 400);
  }

  public changeTheme = () => {
    document.body.classList.toggle('dark');
  }

  private confirmUser = () => {
    this.valideAccess.checkToken().subscribe(resp => {
      if (resp.confirm == true) {
        this.identificacion = this.valideAccess.setDataUser().identificacion
        this.usuario = this.valideAccess.setDataUser().usuario.split(' ')[0]
        this.rol = this.valideAccess.setDataUser().tipo_usuario

        this.rol == 'Administrador' || this.rol == 'Administrativo' || this.rol == 'Instructor' ?
          this.permiso_de_rango = true : this.permiso_de_rango = false
      }
    }, error => {
      if (error && localStorage.getItem('token')) {
        localStorage.clear()
        this.NgRouter.navigate(['login'])
        setTimeout(() => location.reload(), 500);
      }
    })
  }

  async selectPage() {
    this.subscriber$ = this.NgRouter.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(async (event) => {
      let select = document.getElementById(this.selected);
      select.classList.remove('selected')
      let url = event['url'].split('/', 2)[1]
      
      setTimeout(() => {
        if (url.search(/\?/) > 0) this.selected = this.pages['/' + url.split('?')[0]]
        else this.selected = this.pages['/' + url]        
        select = document.getElementById(this.selected)
        select.classList.add('selected')
      }, 500);
    })
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

    if (confirm.role == 'confirm') {
      localStorage.clear();
      this.NgMenu.enable(false);
      return this.NgRouter.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
        this.NgRouter.navigate(["/login"])

        setTimeout(() => {
          location.reload();
        }, 500);
      });
    }
  }
}
