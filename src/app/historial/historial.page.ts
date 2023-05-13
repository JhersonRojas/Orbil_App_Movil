import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { CheckTokenService } from '../middlewares/check-token.service';
import { HistorialService } from '../services/historial.service';
import { DatoElemento, DatoMovimiento } from '../interface/interface';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})

export class HistorialPage implements OnInit {

  elementos: DatoMovimiento[] = [];
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
  ) { }

  ngOnInit() {
    this.confirmUser()
    this.showLoading()
    setTimeout(() => {
      this.list_History();
    }, 1000);
  }

  private confirmUser = () => {
    this.valideAccess.checkToken().subscribe(resp => {
      if (resp.confirm == true) {
        this.identificacion = this.valideAccess.setDataUser().identificacion
        this.token = this.valideAccess.setDataUser().token
      }
    }, error => {
      if (error) {
        localStorage.clear()
        this.NgMenu.enable(false)
        setTimeout(() => this.NgRouter.navigate(['login']), 500);
      }
    })
  }

  private showLoading = async () => {
    const loading = await this.NgLoading.create({
      message: 'Cargando...',
      duration: 800,
    });
    loading.present();
  }

  async list_History() {
    try {
      this.service.History_Service(this.token, this.identificacion).subscribe((resp) => {
        this.elementos = resp.datos;
        if (this.elementos.length == 0) this.noFile = true
      });
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  public mostrarAlerta = async (msj: string) => {
    const alert = await this.NgAlert.create({ message: msj });
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

  cancelReserve = (id_reserva: any) => {
    this.service.cancelReserve(this.token, id_reserva).subscribe((resp) => {

      if (!resp) return this.mostrarAlerta('Tal parece, ocurrio un error al cancelar su reserva')
      if (resp.confirm == false) return this.mostrarAlerta('No ha podido cancelar su reserva, lo sentimos')

      if (resp.confirm == true) {
        this.mostrarAlerta('A cancelado su reserva')

        setTimeout(() => {
          location.reload()
        }, 1500);
      }

    });
  }
}
