import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmbienteService } from '../../services/ambiente.service';
import { CheckTokenService } from 'src/app/middlewares/check-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ambiente',
  templateUrl: './ambiente.page.html',
  styleUrls: ['./ambiente.page.scss'],
})

// Esta clase contiene las funciones y variables de la viste del ambiente
export class AmbientePage implements OnInit {
  select_header = {
    subHeader: 'Elige una jornada a reservar',
  };

  // Variables de los datos del usuario
  permiso_de_rango: boolean = false;
  rol: string;
  usuario: string;
  identificacion: string;

  form: FormGroup; // Los estilos del la barra superior del App
  fecha_hoy: Date = new Date(); // Esta variable recibe la fecha actual, esto es un componente propio de angular
  respuesta: any; // "respuesta" recibe los datos recibidos

  // Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar
  alerta: any;

  // Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form"
  todo: any;
  jornada: any; // Esta variable toma la jornada elegida desde el formulario del HTML
  fecha: any; // Esta variable toma la fecha elegida desde el formulario del HTML
  fecha_fin: any;
  token: string;

  // El constructor obtiene los parametros importados de diferentes componentes
  constructor(
    private service: AmbienteService, // "service" obtiene los servicios proporcionados desde ambiente service
    private valideAccess: CheckTokenService,
    private NgFb: FormBuilder, // "NgFb" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML
    private NgAlert: AlertController, // "NgAlert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas
    private NgRouter: Router,
    private NgMenu: MenuController
  ) { }

  // Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista
  ngOnInit() {
    this.confirmUser()
    // "form" añade los datos en el momento que alguien diligencie el formulario en la vista
    this.form = this.NgFb.group({
      fecha: ['', Validators.required],
      jornada: ['', Validators.required],
    });
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
        this.NgMenu.enable(false)
        setTimeout(() => this.NgRouter.navigate(['login']), 500);
      }
    })
  }

  // Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable
  public cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  private showAlert = async (msj: string) => {
    const alert = await this.NgAlert.create({ message: msj });
    await alert.present();
  }

  // Es la primera verificación para confirmar la reserva del usuario
  public confirmReserve = async () => {
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
    if (confirm.role == 'confirm') return this.reserveAmbiente();
  }

  // Estos son los datos que se envian a las variables antes mencionadas
  public reserveAmbiente = () => {
    //  Estos son los datos que se envian a las variables antes mencionadas
    this.fecha = this.form.value.fecha;
    this.jornada = this.form.value.jornada;
    this.fecha_fin = this.fecha.split('T', 1);

    // -Estos son los datos que se envian a las variables antes mencionadas
    this.todo = {
      usuario: this.identificacion,
      jornada: this.form.value.jornada,
      fecha: this.fecha_fin[0],
    };

    this.service.Reservar_Ambiente_Service(this.todo).subscribe((resp) => {
      this.respuesta = resp;
      if (this.respuesta.confirm)
        return this.showAlert(`Ha reservado el ambiente en \n ${this.fecha_fin[0]}, horario ${this.jornada} 🤩`);
      if (!this.respuesta.confirm)
        return this.showAlert('Ya existe una reserva aqui, lo sentimos 😥');
      else
        return this.showAlert('Ocurrio un error en el pedido, lo sentimos 😒');
    });
  }
}
