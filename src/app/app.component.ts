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

  token: any;
  identificacion: any;
  usuario: any;
  rol: any;
  permiso_de_rango: boolean;

  selected: any;
  other: any;

  pages: {} = {
    raiz: ' ',
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
  ) { }

  ngOnInit() {
    this.selected = '1';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) document.body.classList.toggle('light');
    this.confirmUser()
  }

  ngAfterViewInit(): void {
    this.selectPage();
  }

  public changeTheme = () => {
    document.body.classList.toggle('dark');
  }

  private confirmUser = () => {
    this.valideAccess.checkToken().subscribe(resp => {
      if (resp.confirm == true ) {
        this.identificacion = this.valideAccess.setDataUser().identificacion
        this.usuario = this.valideAccess.setDataUser().usuario.split(' ')[0]
        this.rol = this.valideAccess.setDataUser().tipo_usuario
        
        this.rol == 'Administrador' || this.rol == 'Administrativo' || this.rol == 'Instructor' ? 
          this.permiso_de_rango = true : this.permiso_de_rango = false
      }
    }, error => {
      if (error) {
        localStorage.clear()
        setTimeout(() => this.NgRouter.navigate(['login']), 500);
      }
    })
  }

  async selectPage() {
    try {
      this.subscriber$ = this.NgRouter.events.pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(async (event) => {
          console.log('The URL changed to: ' + event['url'].split('/')[1]);
          await this.pages[event['url'].split('/')[1]]
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
      select.setAttribute('style', 'color: #00000; border-left: none');

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
      localStorage.clear();
      this.NgMenu.enable(false);
      return this.NgRouter.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
        this.NgRouter.navigate(["/login"])

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  }
}
