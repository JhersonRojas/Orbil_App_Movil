import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatoMovimiento } from '../interface/interface';
import { HistorialService } from '../services/historial.service';
import { CheckTokenService } from '../middlewares/check-token.service';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})

export class HistorialPage implements OnInit {

  token: string;
  identificacion: string;
  mensaje_final: any;
  noFile: boolean = false;
  elementos: DatoMovimiento[] = [];

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
    this.list_History();
  }

  // Metodo para validar la sesión del usuario
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

  // Componente de un loading que ve el usuario
  private showLoading = async () => {
    const loading = await this.NgLoading.create({
      message: 'Cargando...',
      duration: 800,
    });
    loading.present();
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

  async list_History() {
    try {
      setTimeout(() => {
        this.service.History_Service(this.token, this.identificacion).subscribe((resp) => {
          this.elementos = resp.datos;
          console.log(resp);
              
          if (this.elementos.length == 0) this.noFile = true
        }, error => {
          if (error) return this.noFile = true
        });
      }, 1000);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  cancelReserve = (id_reserva: any) => {
    this.service.cancelReserve(this.token, id_reserva).subscribe((resp) => {
      if (resp.confirm == false) return this.mostrarAlerta('No ha podido cancelar su reserva, lo sentimos')
      else {
        this.mostrarAlerta('A cancelado su reserva')
        setTimeout(() => {
          this.service.History_Service(this.token, this.identificacion).subscribe((resp) => {
            this.elementos = resp.datos;
            if (this.elementos.length == 0) this.noFile = true
          }, error => {
            if (error) return this.noFile = true
          });
        }, 1000);
      }
    }, error => {
      if (error) return this.mostrarAlerta("Lo sentimos, ha ocurrido un error de conexión")
    });
  }
}
