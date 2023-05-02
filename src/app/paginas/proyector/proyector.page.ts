import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Dato } from 'src/app/interface/interface';
import { ProyectorService } from '../../services/proyector.service';
import { CheckTokenService } from 'src/app/middlewares/check-token.service';

@Component({
  selector: 'app-proyector',
  templateUrl: './proyector.page.html',
  styleUrls: ['./proyector.page.scss'],
})

// Clase para el modulos de proyectores
export class ProyectorPage implements OnInit {
  header_proyector = {
    subHeader: 'Elige un proyector a reservar',
  };

  header_jornada = {
    subHeader: 'Elige una jornada a reservar',
  };

  usuario: string;
  identificacion: string;
  rol: string;

  form: FormGroup; //  "form", variable que guarda los datos recibidos del formulario desde el HTML
  fecha_hoy: Date = new Date(); //  Esta variable recibe la fecha actual, esto es un componente propio de angular

  proyectores: any; //  "proyectores" es la variable que guarda los datos recibidos del servicio al Api Rest
  proyector: Dato[] = [];

  //  "respuesta", regresa la respuesta del servidor
  respuesta: any;
  secreto: any;

  // Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form"
  todo: any; // Esta variable agrupa los datos para enviarlos
  serial: any; // Esta variable toma el serial del proyector elegido del HTML
  fecha: any; // Esta variable toma la fecha elegida desde el formulario del HTML
  jornada: any; // Esta variable toma la jornada elegida desde el formulario del HTML
  sitio: any; // Esta variable toma el sitio diligenciado en el formulario del HTML
  token: any;

  // El constructor obtiene los parametros importados de diferentes componentes
  constructor(
    private service: ProyectorService, //  "service" obtiene los servicios proporcionados desde proyectores service
    private valideAccess: CheckTokenService,
    private NgRouter: Router,
    private NgMenu: MenuController,
    private NgFb: FormBuilder, //  "NgFb" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML
    private NgAlert: AlertController // "NgAlert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas
  ) {
    this.saveDataUser()
  }

  //  Función de angular, su contenido es lo primero que se ejecuta al entrar a esta vista
  ngOnInit() {

    // Esta función es la que realiza el llamado al servicio, este ejecuta la consulta al servidor
    this.service.Listar_Proyectores_Service().subscribe(resp => {
      this.proyectores = resp;
      this.proyector = resp.datos;
    });

    // "form" añade los datos en el momento que alguien diligencie el formulario en la vista
    this.form = this.NgFb.group({
      fecha: ['', Validators.required],
      jornada: ['', Validators.required],
      serial: ['', Validators.required],
      sitio: [''],
    });
  }

  private saveDataUser () {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      this.NgMenu.enable(false)
      localStorage.clear()
      setTimeout(() => {
        this.NgRouter.navigate(['/login']);
      }, 400);
    }
    else {
      this.valideAccess.checkToken(this.token).subscribe(resp => {
        if (resp.confirm) {
          this.identificacion = localStorage.getItem('identificacion');
          this.rol = localStorage.getItem('tipo_usuario');
          this.usuario = localStorage.getItem('usuario').split(' ', 1)[0];
        }
      }, error => {
        if (error.error.confirm === false) {
          this.NgMenu.enable(false)
          localStorage.clear()
          setTimeout(() => {
            this.NgRouter.navigate(['/login'], {skipLocationChange: true});
          }, 400);
        }
      });
    }
  }

  // Función que cancela la posibilidad de elegir fines de semana en el calendario desplegable
  public cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  // Función que permite enviar un mensaje emergente al realizarse una reserva
  async showAlert(msj: string) {
    const alert = await this.NgAlert.create({ message: msj });
    await alert.present();
  }

  // Muestra una ventana para confirmar la reserva y regresa una respuesta
  async confirmReserve() {
    const alert = await this.NgAlert.create({
      header: `Confirmar la reserva?`,
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
    if (confirm.role == 'confirm') return this.reserveProyector();
  }

  // Esta función envia los datos previamente recibidos del formulario del HTML y los envia al servidor
  private reserveProyector = () => {
    // Estos son los datos que se envian a las variables antes mencionadas
    this.fecha = this.form.value.fecha;
    this.jornada = this.form.value.jornada;
    this.serial = this.form.value.serial;
    this.sitio = this.form.value.sitio;

    this.todo = {
      usuario: this.identificacion,
      jornada: this.form.value.jornada,
      fecha: this.fecha,
      serial: this.form.value.serial,
      sitio: this.form.value.sitio,
    };

    // Este segmento recopila los datos de la reserva y los envia, tambien recive la respuesta del Api Rest
    this.service.Reservar_Proyector_Service(this.todo).subscribe(resp => {
      this.respuesta = resp;
      //  Aqui tambien se envia el mensaje en caso de que la reserva sea valida o no
      if (resp === undefined) return this.showAlert('No se encuentra conectado al servidor');
      if (this.respuesta.confirm) return this.showAlert( `Ha reservado el proyector en ${this.fecha.split('T', 1)[0]}` );
      if (!this.respuesta.confirm) return this.showAlert(`Ya reservaron este proyector aqui, lo sentimos 😥`);
      else return this.showAlert('No se reconoce la respuesta del servidor');
    });
  };
}
