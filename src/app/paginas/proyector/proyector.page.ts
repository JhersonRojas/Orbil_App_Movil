import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectorService } from '../../services/proyector.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-proyector',
  templateUrl: './proyector.page.html',
  styleUrls: ['./proyector.page.scss'],
})

    // <----------------- Esta clase contiene las funciones y variables del modulo de proyector ------------------->
export class ProyectorPage implements OnInit {

  permiso: boolean = false 
    rol: string  
    usuario:string 
    identificacion: string 

    // <----------------- "form" es la variable que guarda los datos recibidos de "Fb" desde el HTML ------------------->
  form: FormGroup;

    // <----------------- "nombre" e "id" son las variable que tomaran los datos del LocalStorage -------------------------->
        // <--- El localStorage es un almacenamiento interno, este tiene guardados los datos del usuario que accedio --->
  nombre= localStorage.getItem('usuario');
  id = localStorage.getItem('identificacion');

    // <----------------- Esta variable recibe la fecha actual, esto es un componente propio de angular ------------------->
  fechaHoy:Date = new Date();
  
    // <------------- "proyectores" es la variable que guarda los datos recibidos del servicio al Api Rest --------------->
  proyectores:any;

    // <----------------- "respuesta" recibe los datos recibidos  ------------------->
  respuesta:  any;
    secreto: any 

    // <---------- Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form" ------------>
  todo:       any; // <--- Esta variable agrupa los datos para enviarlos --->
    serial:   any; // <--- Esta variable toma el serial del proyector elegido del HTML --->
    fecha:    any; // <--- Esta variable toma la fecha elegida desde el formulario del HTML --->
    jornada:  any; // <--- Esta variable toma la jornada elegida desde el formulario del HTML --->
    sitio:    any; // <--- Esta variable toma el sitio diligenciado en el formulario del HTML --->
  
    // <--------- Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar --------------->
  alerta:     any; 
    alertFin: any;

    // <----------------- El constructor obtiene los parametros importados de diferentes componentes ------------------->
  constructor(
      // <----------------- "service" obtiene los servicios proporcionados desde proyectores service ------------------->
    private service: ProyectorService,

      // <---- "FB" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML ------>
    private FB: FormBuilder,
    
      // <--------- "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden ----------->
    private route: Router,

      // <--------- "alert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas ----------->
    private alert: AlertController) {}
  
    // <----------------- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista ------------------->
  ngOnInit() {

      // <----------------- Esta función es la que realiza el llamado al servicio, este ejecuta la consulta al Api Rest ------------------->
    this.service.Listar_Proyectores_Service().subscribe(
    resp => {
          // <------- "resp" es lo obtenido de la consulta, los datos que contiene se añaden a la variable llamada "proyectores" --------->
        this.proyectores = resp
      });

      // <----------------- "for" añade los datos en el momento que alguien diligencie el formulario en la vista ------------------->
    this.form = this.FB.group({
        fecha   : ['', Validators.required],
        jornada : ['', Validators.required],
        serial  : ['', Validators.required],
        sitio   : [''],
      });   
    
      // <----------------- "return" llama a la función de "validarDatos" ------------------->
    return this.ValidarDatos()
  }

    // <------------- Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva --------------->
  async mostrarAlerta() {
    const total = await this.alertFin
    const alert = await this.alert.create({ message:total});
    await alert.present();
    console.log(total)
  }

    // <--- Esta función envia los datos previamente recibidos del formulario del HTML y los envia al Api Rest --->
  ReservaProyector(){
      // <--- Estos son los datos que se envian a las variables antes mencionadas --->
    this.fecha = this.form.value.fecha
    this.jornada = this.form.value.jornada
    this.serial = this.form.value.serial
    this.sitio = this.form.value.sitio

    this.todo = { usuario : this.id, 
                  jornada : this.form.value.jornada,
                  fecha   : this.fecha,
                  serial  : this.form.value.serial,
                  sitio   : this.form.value.sitio };
          
        // <--- Este segmento recopila los datos de la reserva y los envia, tambien recive la respuesta del Api Rest --->  
        // <--- Aqui tambien se envia el mensaje en caso de que la reserva sea valida o no --->
    this.service.Reservar_Proyector_Service(this.todo).subscribe(
        resp => {
          this.respuesta = (resp)
          this.alerta = this.respuesta.boolean

          if ( this.alerta == "false") {this.alertFin = "Lo siento, alguien ya reservo aqui"} 
          else { this.alertFin = "A reservado el proyector en la fecha " + this.fecha }
            return this.mostrarAlerta()
    });
  }

    // <----------- Esta función confirma si los datos del usuario son validos, de no, lo regresara al login ------------->
  async ValidarDatos(){
    try { 
      let token = localStorage.getItem('token')
      if (token){
        this.rol = localStorage.getItem('tipo_usuario')
        this.usuario = localStorage.getItem('usuario')
        this.identificacion = localStorage.getItem('identificacion')

          if(this.rol == "Instructor" || this.rol == "Administrativo") 
            {this.permiso = true } else { this.permiso = false}

      } else {this.route.navigate(['/login'])}
    } catch (error){}
  }

} // Este es el cierre de la clase de proyector 
