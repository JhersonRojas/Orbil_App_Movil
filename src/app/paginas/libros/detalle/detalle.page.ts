import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { librosService } from 'src/app/services/libros.service';
import { AlertController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckTokenService } from 'src/app/middlewares/check-token.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {
  //  Esta variable recibe la fecha actual, esto es un componente propio de angular
  fechaHoy: Date = new Date();
  fecha: any;
  fecha_fin: any;

  //  "form" es la variable que guarda los datos recibidos de "Fb" desde el HTML
  form: FormGroup;

  //  "info_de_envio" recibe los datos recibidos
  info_de_envio: any;

  //   Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form"
  libro: any;
  serial: any;
  Nombre: any;
  Autor: any;
  Descripcion: any;
  Imagen: any;

  // Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar
  token: string;
  identificacion: any;
  usuario: any;
  rol: any;

  constructor(
    private service: librosService, // "service" obtiene los servicios proporcionados desde proyectores service
    private valideAccess: CheckTokenService, // "access token service"
    private NgMenu: MenuController,
    private NgRouter: Router,
    private NgFb: FormBuilder, // "FB" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML
    private NgActiveRouter: ActivatedRoute, // "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden
    private NgAlert: AlertController // "NgAlert", directiva de angular que muestra un mensaje emergente
  ) { }

  //  Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista
  ngOnInit() {
    this.confirmUser();
    let idl = this.NgActiveRouter.snapshot.paramMap.get('idl');
    //  "for" añade los datos en el momento que alguien diligencie el formulario en la vista
    this.form = this.NgFb.group({ fecha: ['', Validators.required] });
    this.mostrarLibro(idl);
  }

  private confirmUser = () => {
    this.valideAccess.checkToken().subscribe(
      (resp) => {
        if (resp.confirm == true) {
          this.identificacion = this.valideAccess.setDataUser().identificacion;
          this.usuario = this.valideAccess.setDataUser().usuario.split(' ')[0];
          this.rol = this.valideAccess.setDataUser().tipo_usuario;
        }
      },
      (error) => {
        if (error) {
          localStorage.clear();
          this.NgMenu.enable(false);
          setTimeout(() => this.NgRouter.navigate(['login']), 500);
        }
      }
    );
  };

  private mostrarLibro = (idl: string) => {
    this.service.Listar_Un_Libro(idl).subscribe((resp) => {
      this.libro = resp.datos;
      this.serial = this.libro.Pk_Elemento;
      this.Nombre = this.libro.Nombre_Elemento;
      this.Autor = this.libro.Autor;
      this.Descripcion = this.libro.Descripcion;
      this.Imagen = this.libro.Imagen;
    });
  };

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  private mostrarAlerta = async (msj: string) => {
    const alert = await this.NgAlert.create({ message: msj });
    await alert.present();
  };

  // Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable
  public cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

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
    if (confirm.role == 'confirm') return this.reservarLibro();
  };

  // Esta función tomas los datos del usuario y del libro para enviarlos al Api Rest
  public reservarLibro = () => {
    this.fecha = this.form.value.fecha;
    this.fecha_fin = this.fecha.split('T', 1);

    this.info_de_envio = {
      fecha: this.fecha_fin[0],
      usuario: this.identificacion,
      serial: this.serial,
    };

    //  Este modulo recibe la respuesta del Api dependiendo si los datos son correctos o no
    this.service.Reservar_Libro(this.info_de_envio).subscribe(
      (resp) => {
        if (resp.confirm == false) return this.mostrarAlerta('Lo siento, alguien ya reservo este libro');
        else return this.mostrarAlerta('A reservado el libro en la fecha \n ' + this.fecha_fin);
      },
      (error) => {
        if (error) return this.mostrarAlerta('Lo sentimos, ha ocurrido un error de conexión');
      }
    );
  };
}
