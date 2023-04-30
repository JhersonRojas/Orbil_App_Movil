import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComputadoresService } from '../../services/computador.service';
import { AlertController, IonModal } from '@ionic/angular';
import { CheckTokenService } from 'src/app/middlewares/check-token.service';

@Component({
  selector: 'app-computador',
  templateUrl: './computador.page.html',
  styleUrls: ['./computador.page.scss'],
})

// Esta clase contiene las funciones y variables del modulo de computador
export class ComputadorPage implements OnInit {

  // Referencia al despliegue del Modal de computadores 
  @ViewChild('modal', { static: true }) modal!: IonModal;

  // Variables de los datos mostrados en el formulario
  selectedComputerText = '0 💻';
  selectedComputer: string[] = [];

  usuario: string;
  identificacion: string;

  // Esta variable almacena la cantidad de computadores que envia el Api Rest
  computadores: any;
  computadores_permiso: boolean = true;
  computadores_muestra: any;
  computadores_cantidad: string | number = 'Elija el día';

  form: FormGroup; // "form" es la variable que guarda los datos recibidos de "Fb" desde el HTML
  fecha_hoy: Date = new Date(); // Esta variable recibe la fecha actual, esto es un componente propio de angular

  // Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar
  mensaje: any;
  mensaje_final: string;

  // "respuesta" recibe los datos retornados por el Api Rest al realizar una reserva 
  respuesta: any;

  // Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form"
  todo: any;
  cantidad: number;
  fecha: any;
  nombre: any;
  fecha_fin: any;

  // El constructor obtiene los parametros importados de diferentes componentes
  constructor(
    private service: ComputadoresService, // "service" obtiene los servicios proporcionados desde ambiente service
    private valideAccess: CheckTokenService, // valideAccess obtiene la verificación del inicio de sesión
    private NgFb: FormBuilder, // "FB" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML
    private NgAlert: AlertController // "alert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas
  ) {
    this.valideAccess.checkToken().then(() => {
      this.usuario = localStorage.getItem('usuario').split(' ', 1)[0];
      this.identificacion = localStorage.getItem('identificacion');
    });
  }

  // Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista
  ngOnInit() {
    // "form" añade los datos en el momento que alguien diligencie el formulario en la vista
    this.form = this.NgFb.group({ fecha: ['', Validators.required], });
  }

  // Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable
  public cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  public mostrarAlerta = async () => {
    const total = this.mensaje_final;
    const alert = await this.NgAlert.create({ message: total });
    await alert.present();
  }

  // Esta función llama la cantidad e informacion de los computadores disponibles actualmente
  public filtradoPorDia = (event: any) => {
    let fecha = event.detail.value
    fecha = fecha.split('T', 1)[0];
    this.service.Disponibles_Computador_Service(fecha).subscribe(resp => {
      console.log(resp);
      this.computadores_muestra = resp.datos
      if (!resp.confirm) return (this.computadores_cantidad = 'No es valido!');
      if (resp.confirm) {
        this.computadores_permiso = false;
        return this.computadores_cantidad = resp.cantidad 
      }
      return (this.computadores_cantidad = 'No se encuentran equipos');
    });
  }

  // Aqui cambia el valor de los computadores mostrados
  private formatData(data: string[]) {
    return `${data.length} 💻`;
  }

  // Función para obtener la cantidad de computadores elegidos por el usuario
  public computerSelectionChanged = async (computer: string[]) => {
    this.selectedComputer = computer;
    this.selectedComputerText = this.formatData(this.selectedComputer);
    await this.modal.dismiss();
  }

  // Esta función se encarga de agrupar los datos y enviarlos por medio del servicio al Api Rest
  public reserveComputer = async () => {

    // Validacion de si elegieron algún computador
    if (this.selectedComputer.length == 0) {
      this.mensaje_final = 'Lo siento, debe elegir minimo un computador';
      return this.mostrarAlerta();
    }

    // Fecha a reservar de los computadores
    this.fecha = this.form.value.fecha;
    this.fecha_fin = this.fecha.split('T', 1)[0];

    // Aqui se estan enviando los datos y recibiendo la respuesta del Api respecto a su validación
    this.todo = {
      usuario: this.identificacion,
      computadores: this.selectedComputer,
      fecha: this.fecha_fin,
    };

    // Llamado al servicio para realziar la petición y hacer la reserva
    this.service.Reservar_Computador_Service(this.todo).subscribe(resp => {
      this.respuesta = resp;
      this.mensaje = this.respuesta.confirm;
      if (this.mensaje == false)
        this.mensaje_final = 'Lo siento, algún computador que eligio no esta disponible';
      if (this.mensaje == false && this.respuesta == 'A excedido el limite para reservar')
        this.mensaje_final = 'Lo siento, no se encuentra esa cantidad disponible';
      if (this.mensaje == true)
        this.mensaje_final = `Se han reservado ${this.selectedComputer.length} computadores`, this.computadores_permiso = true;
      else
        this.mensaje_final = `No se han reservado los computadores, esto puede ser un error, por favor comuniquelo con los administradores`;

      // Este "return" me regresa la función de mostrarAlert, lo que muestra el mensaje emergente en la vista al reservar
      return this.mostrarAlerta();
    });
  }
}
