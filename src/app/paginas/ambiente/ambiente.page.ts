import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmbienteService } from '../../services/ambiente.service';

@Component({
  selector: 'app-ambiente',
  templateUrl: './ambiente.page.html',
  styleUrls: ['./ambiente.page.scss'],
})

    // <--- Esta clase contiene las funciones y variables de la viste del ambiente --->
export class AmbientePage implements OnInit  { 

  permiso:        boolean = false 
    rol:            string;  
    usuario:        string; 
    identificacion: string; 

  select_header = {
    subHeader: 'Elige una jornada a reservar',
  };

  form: FormGroup; // <--- Los estilos del la barra superior del App --->

    // <----------------- "nombre" e "id" son las variable que tomaran los datos del LocalStorage -------------------------->
    // <--- El localStorage es un almacenamiento interno, este tiene guardados los datos del usuario que accedio --->
  nombre= localStorage.getItem('usuario').split(' ', 1)[0];
  id = localStorage.getItem('identificacion');

    // <-- Esta variable recibe la fecha actual, esto es un componente propio de angular -->
  fechaHoy: Date = new Date();

    // <-- "respuesta" recibe los datos recibidos  -->
  respuesta:  any;

    // <--------- Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar -->
  alerta:     any; 

    // <---------- Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form" ------------>
  todo:          any;
    jornada:     any; // <--- Esta variable toma la jornada elegida desde el formulario del HTML --->
    fecha:       any; // <--- Esta variable toma la fecha elegida desde el formulario del HTML --->
      fecha_fin: any; 

    // <-- El constructor obtiene los parametros importados de diferentes componentes ---->
  constructor(
    private service: AmbienteService, // <-- "service" obtiene los servicios proporcionados desde ambiente service -->
    private NgFb: FormBuilder, // <-- "NgFb" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML -->
    private NgRouter: Router, // <-- "NgRouter" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->
    private NgAlert: AlertController // <-- "NgAlert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas -->
  ) {
    this.checkToken()
  }
  
    // <-- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista ---->
  ngOnInit() {
      // <-- "form" añade los datos en el momento que alguien diligencie el formulario en la vista ---->
    this.form = this.NgFb.group({
      fecha   : ['', Validators.required],
      jornada : ['', Validators.required],
      usuario : [this.id, Validators.required]
    }); 
  }

    // <-- Esta función confirma si los datos del usuario son validos, de no, lo regresara al login -->
  async checkToken(){
    try { 
      const token = localStorage.getItem('token')
      if (!token) return this.NgRouter.navigate(['/login'])
      
      this.rol = localStorage.getItem('tipo_usuario')
      this.usuario = localStorage.getItem('usuario')
      this.identificacion = localStorage.getItem('identificacion')

      if (this.rol == "Instructor" || this.rol == "Administrativo") this.permiso = true 
      else  this.permiso = false
      
    } catch (error){
      console.log('error :>> \n ', error);
    }
  }

    // <------------- Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva --------------->
  async showAlert( msj: string ) {
    const alert = await this.NgAlert.create({ message:msj});
    await alert.present();
  }

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

    if ( confirm.role == 'confirm') return this.Reserve();
  }

      // <------------------- Estos son los datos que se envian a las variables antes mencionadas -------------->
  async Reserve() {
      // <-------------------- Estos son los datos que se envian a las variables antes mencionadas --------------->
    this.fecha = this.form.value.fecha
    this.jornada = this.form.value.jornada
    this.usuario = this.form.value.usuario
    this.fecha_fin = this.fecha.split("T",1)

      // <--------------- Estos son los datos que se envian a las variables antes mencionadas --------------------->
    this.todo = { usuario: this.form.value.usuario, jornada : this.form.value.jornada, fecha : this.fecha_fin[0]}

    console.log(this.todo);
    
      await this.service.Reservar_Ambiente_Service(this.todo).subscribe(
        resp => {
          this.respuesta = (resp)
          
          if ( this.respuesta.confirm === true ) return this.showAlert(`Ha reservado el ambiente en ${this.fecha_fin[0]}, horario ${this.jornada} 🤩` )
          if ( this.respuesta.confirm === false) return this.showAlert('Ya existe una reserva aqui, lo sentimos 😥')

          return this.showAlert('Ocurrio un error en el pedido, lo sentimos 😒')
    });
  }

    // <---------- Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable ---------->
  cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

}