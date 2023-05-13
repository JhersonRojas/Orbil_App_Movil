import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { CheckTokenService } from '../middlewares/check-token.service';
import { HistorialService } from '../services/historial.service';
import { DatoElemento } from '../interface/interface';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})

export class HistorialPage implements OnInit {

  respuesta: any;
  elementos: DatoElemento[] = [];
  identificacion: string;
  token: string;
  mensaje_final: any;
  noFile: boolean = false;

  constructor(
    private service: HistorialService,
    private valideAccess: CheckTokenService,
    private NgRouter: Router,
    private NgLoading: LoadingController,
    private NgMenu: MenuController,
    private NgAlert: AlertController // "alert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas
  ) {
    this.saveDataUser();
  }

  ngOnInit() {
    this.showLoading()
    setTimeout(() => {
      this.list_History();
    }, 1000);
  }

  async showLoading() {
    const loading = await this.NgLoading.create({
      message: 'Cargando...',
      duration: 800,
    });
    loading.present();
  }

  private saveDataUser = () => {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      this.NgMenu.enable(false);
      localStorage.clear();
      setTimeout(() => {
        this.NgRouter.navigate(['/login']);
      }, 500);
    } else {
      this.valideAccess.checkToken(this.token).subscribe((resp) => {
        if (resp.confirm) {
          this.identificacion = localStorage.getItem('identificacion');
        }
      }, (error) => {
        if (error.error.confirm) {
          this.NgMenu.enable(false);
          localStorage.clear();
          setTimeout(() => {
            this.NgRouter.navigate(['/login'], { skipLocationChange: true });
          }, 500);
        }
      }
      );
    }
  };

  async list_History() {
    try {
      this.service
        .History_Service(this.token, this.identificacion)
        .subscribe((resp) => {
          this.respuesta = resp;
          this.elementos = resp.datos;
          if (this.elementos.length == 0) this.noFile = true
        });
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  public mostrarAlerta = async () => {
    const alert = await this.NgAlert.create({ message: this.mensaje_final });
    await alert.present();
  };

  public cancelReserveAlert = async (id_reserva: any) => {
    const alert = await this.NgAlert.create({
      header: `Cancealar reservación?`,
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
    if (confirm.role == 'confirm') return this.cancelReserve(id_reserva);
  };

  async cancelReserve(id_reserva: any) {
    try {
      this.service.cancelReserve(this.token, id_reserva).subscribe((resp) => {

        if (!resp) {
          this.mensaje_final = 'Tal parece, ocurrio un error al cancelar su reserva'
          return this.mostrarAlerta()
        }

        if (resp.confirm == false) { 
          this.mensaje_final = 'No ha podido cancelar su reserva, lo sentimos'
          return this.mostrarAlerta()
        }

        if (resp.confirm == true) {
          this.mensaje_final = 'A cancelado su reserva'
          this.mostrarAlerta()

          setTimeout(() => {
            window.location.reload()
          }, 1500);
        } 
      
      });
    } catch (error) { }
  }
}
