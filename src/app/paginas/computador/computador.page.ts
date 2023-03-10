import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComputadoresService } from '../../services/computador.service';
import { AlertController, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-computador',
  templateUrl: './computador.page.html',
  styleUrls: ['./computador.page.scss'],
})

  // <-- Esta clase contiene las funciones y variables del modulo de computador -->
export class ComputadorPage implements OnInit {

  permiso: boolean = false 
    rol:            string;  
    usuario:        string;
    identificacion: string;
    token:          string;

    // <-- Esta variable almacena la cantidad de computadores que envia el Api Rest -->
  computadores:       any;
    inventario:       any;
    disponible: any;

    // <-- "form" es la variable que guarda los datos recibidos de "Fb" desde el HTML -->
  form: FormGroup;

    // <-- Esta variable recibe la fecha actual, esto es un componente propio de angular -->
  fechaHoy: Date = new Date();

    // <-- "respuesta" recibe los datos retornados por el Api Rest al realizar una reserva  -->
  respuesta:          any;
   
      // <-- Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar -->
  mensaje:            any;
    mensajefinal:  string;

      // <-- Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form" -->
  todo:               any;
    cantidad:      number;
    fecha:            any;
    nombre:           any;
    fecha_fin:        any;

    // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private service: ComputadoresService, // <-- "service" obtiene los servicios proporcionados desde ambiente service -->
    private NgFb: FormBuilder, // <-- "FB" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML -->
    private NgRouter: Router, // <-- "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->
    private NgAlert: AlertController // <-- "alert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas -->
  ) {
    this.checkToken();
  }
    
    // <-- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista -->
  ngOnInit() {
    this.get_Computers();
      // <-- "form" añade los datos en el momento que alguien diligencie el formulario en la vista -->
    this.form = this.NgFb.group({
      fecha    : ['', Validators.required],
    });
  }

    // <----------- Esta función confirma si los datos del usuario son validos, de no, lo regresara al login ------------->
  async checkToken(){
    try { 
      this.token = localStorage.getItem('token')
      if (!this.token) return this.NgRouter.navigate(['/login'])

      this.rol = localStorage.getItem('tipo_usuario')
      this.usuario = localStorage.getItem('usuario').split(' ', 1)[0]
      this.identificacion = localStorage.getItem('identificacion')

      if(this.rol == "Instructor" || this.rol == "Administrativo") return this.permiso = true 
      else return this.permiso = false

    } catch (error){ 
      console.log('error :>> ', error); 
    }
  }

    // <------------- Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva --------------->
  async showAlert() {
    const total = this.mensajefinal
    const alert = await this.NgAlert.create({ message:total});
    await alert.present();
    console.log(total)
  }

  async get_Computers() {
    this.service.Cantidad_Computador_Service().subscribe(resp => {
      this.inventario = (resp.datos)
      console.log('this.inventario :>> ', this.inventario);
      if (!resp.confirm) return this.disponible = 'No es valido!'
      if ( resp.confirm == true ) return this.disponible = (resp.cantidad)
      return this.disponible = 'No se encuentran equipos'
    })
  }

  @ViewChild('modal', { static: true }) modal!: IonModal;
  
  selectedComputerText = '0 💻';
  selectedComputer: string[] = [];

  private formatData(data: string[]) {
    return `${data.length} 💻`;
  }
  
  computerSelectionChanged(computer: string[]) {
    this.selectedComputer = computer;
    this.selectedComputerText = this.formatData(this.selectedComputer);
    this.modal.dismiss();
  }

  // <------- Esta función se encarga de agrupar los datos y enviarlos por medio del servicio al Api Rest -------->
  async reserveComputer() {
    if (!this.token) return this.NgRouter.navigate(['/login'])
    this.fecha =   this.form.value.fecha
    this.fecha_fin = this.fecha.split("T",1)[0]

      // <----------------- Aqui se estan enviando los datos y recibiendo la respuesta del Api respecto a su validación ------------------->
    this.todo = { usuario: this.identificacion, computadores : this.selectedComputer, fecha : this.fecha_fin }

    console.log('this.todo :>> ', this.todo);

    this.service.Reservar_Computador_Service(this.todo).subscribe(
      resp => {
        this.respuesta = (resp)
        this.mensaje = this.respuesta.confirm;
        
        if ( this.mensaje == false ){ this.mensajefinal = "Lo siento, algún computador que eligio no esta disponible"}
        if ( this.mensaje == false && this.respuesta == "A excedido el limite para reservar"){ this.mensajefinal = "Lo siento, no se encuentra esa cantidad disponible"}
        else {this.mensajefinal = `Se han reservado ${this.selectedComputer.length} computadores`}

        console.log('resp :>> ', resp);

        // <------- Este "return" me regresa la función de mostrarAlert, lo que muestra el mensaje emergente en la vista al reservar --------->
        return this.showAlert()
    });
  }

    // <---------- Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable ---------->
  cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

}