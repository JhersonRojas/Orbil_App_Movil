import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CheckTokenService } from './middlewares/check-token.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  darkMode: boolean = false;
  public subscriber$: Subscription;

  rol: any;
  usuario: any;
  identificacion: any;
  permiso_de_rango: boolean;

  selected: any;
  other: any;

  pages: {} = {
    login: '1',
    home: '1',
    lista: '2',
    detalle: '2',
    computador: '3',
    proyector: '4',
    ambiente: '5',
    permisos: '6',
    historial: '7',
    manual: '8',
  };

  constructor(
    private valideAccess: CheckTokenService,
    private NgAlert: AlertController,
    private NgRouter: Router,
    private NgMenu: MenuController /* "NgMenu" me permite controlar el manejo del menú desplegable, como mostrarlo o no */
  ) {
    this.NgMenu.enable(false);
    setTimeout(() => {
      this.saveDataUser();
    }, 500);
  }

  ngOnInit() {
    this.selected = '1';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) document.body.classList.toggle('light');
  }

  ngAfterViewInit(): void {
    this.selectPage();
  }

  private saveDataUser() {
    this.valideAccess.checkToken().then( permiso => {
      if (permiso) {
        this.identificacion = localStorage.getItem('identificacion');
        this.rol = localStorage.getItem('tipo_usuario');
        this.usuario = localStorage.getItem('usuario').split(' ', 1)[0];
        if (this.rol == 'Instructor' || this.rol == 'Administrador' || this.rol == 'Administrativo')
          this.permiso_de_rango = true
      }
    });
  }

  public changeTheme = () => {
    document.body.classList.toggle('dark');
  }

  async selectPage() {
    try {
      this.subscriber$ = this.NgRouter.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(async (event) => {
          console.log('The URL changed to: ' + event['url'].split('/')[1]);
          (await this.pages[event['url'].split('/')[1]]) ?? console.log('No se reconocio esta pagina');
          this.other = this.pages[event['url'].split('/')[1]];
          return this.selectList();
        });
    } catch (error) {
      console.log('error :>> \n', error);
    }
  }

  async selectList(e = null) {
    try {
      let select: any = document.getElementById(this.selected);
      select.setAttribute('style', 'color: rgb(85, 85, 85); border-left: 0');

      if (e === null) {
        this.selected = this.other;
        select = document.getElementById(this.selected);
        return select.setAttribute(
          'style',
          'color: #39A100; border-left: 5px solid green'
        );
      }

      this.selected = e.srcElement.attributes.id.value;
      select = document.getElementById(this.selected);
      return select.setAttribute(
        'style',
        'color: #39A100; border-left: 5px solid green'
      );
    } catch (error) {
      console.log('error :>> ', error);
    }
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
      const close = async () => {
        localStorage.clear();
        this.NgRouter.navigate(['/login']);
        this.NgMenu.enable(false);
      };
      return close();
    }
  }
}
