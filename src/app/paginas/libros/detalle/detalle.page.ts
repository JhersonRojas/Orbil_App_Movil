import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { librosService } from 'src/app/services/libros.service';
import { AlertController } from '@ionic/angular';
import { Dato } from 'src/app/interface/interface';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

     // <----------------- Esta variable recibe la fecha actual, esto es un componente propio de angular ------------------->
  fechaHoy:Date = new Date();
    fecha: any
    fecha_fin: any 

    // <----------------- "form" es la variable que guarda los datos recibidos de "Fb" desde el HTML ------------------->
  form: FormGroup;

    // <----------------- "respuesta" recibe los datos recibidos  ------------------->
  respuesta:  any;
   
    // <---------- Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form" ------------>
  todo: any 
    libro: any
      serial: any
      Nombre: any
      Autor: any
      Descripcion: any
      Imagen: any

  usuario: any
    rol: any
    identificacion: any 
    datos_usuario: any

    // <--------- Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar --------------->
  alerta:     any; 
    alertFin: any;

  constructor(
    private service: librosService, // <-- "service" obtiene los servicios proporcionados desde proyectores service -->
    private NgFb: FormBuilder, // <-- "FB" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML -->
    private NgRouter: ActivatedRoute, // <-- "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->
    private NgAlert: AlertController) {}// <-- "alert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas -->

      // <----------------- Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista ------------------->
  ngOnInit() {
    let idl = this.NgRouter.snapshot.paramMap.get('idl');
    this.service.Listar_Un_Libro(idl).subscribe( resp => {
      this.Nombre = (resp.datos.Nombre_Elemento)
      this.Imagen = (resp.datos.Imagen)
      this.Autor = (resp.datos.Autor)
      this.Descripcion = (resp.datos.Descripcion)
      this.serial = (resp.datos.Pk_Elemento)
    })

        // <----------------- "for" añade los datos en el momento que alguien diligencie el formulario en la vista ------------------->
    this.form = this.NgFb.group({
    fecha : ['', Validators.required],
    }); 

    // <------------------ Aqui estoy obteniendo los datos del usuario previamente guardados ------------------------->
    this.rol = localStorage.getItem('tipo_usuario')
    this.usuario = localStorage.getItem('usuario')
    this.identificacion = localStorage.getItem('identificacion')
  }

    // <------------- Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva --------------->
  async mostrarAlerta() {
    const total = await this.alertFin
    const alert = await this.NgAlert.create({ message:total});
    await alert.present();
    console.log(total)
  }
  
      // <---------- Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable ---------->
  cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };  

    // <----------------- Esta función tomas los datos del usuario y del libro para enviarlos al Api Rest ------------------>
  ReservarLibro(){
    this.fecha = this.form.value.fecha
    this.fecha_fin = this.fecha.split("T",1)

    this.todo = {fecha: this.fecha_fin[0], usuario: this.identificacion, serial: this.serial}
    
      // <----------- Este modulo recibe la respuesta del Api dependiendo si los datos son correctos o no ------------>
    this.service.Reservar_Libro(this.todo).subscribe(
      resp => {
        this.respuesta = (resp)
        this.alerta = (resp.confirm)
          if ( this.alerta == false){ this.alertFin = "Lo siento, alguien ya reservo este libro" } 
          else { this.alertFin = "A reservado el libro en la fecha " + this.fecha_fin }
          console.log('resp :>> ', resp);
          return this.mostrarAlerta()
      }
    )
  }

}
