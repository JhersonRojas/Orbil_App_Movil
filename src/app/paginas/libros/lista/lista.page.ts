import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Dato } from 'src/app/interface/interface';
import { librosService } from 'src/app/services/libros.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})

  // <-- Esta clase contiene las distintas funciones y variables del modulo de la lista de los libros -->
export class ListaPage implements OnInit {

    // <-- Estas son las variables que almacenan la información obtenida del la categoria previamente elegida -->
  libros:    Dato[] = [];
    titulo_cat:   string;
    searchLibros:    any; 
      setLibro:      any;
      serial:     string;
      setNombre:  string;
      setAutor:   string;
      setImg:     string;
      setDesc:    string;

    // <-- Aqui se almacena el mensaje del Api Rest dependiendode su respuesta -->
  respuesta:         any;
    aviso:           any;
    boolean:     boolean;

  form: FormGroup;
    fechaHoy:Date = new Date();
    fecha:      any;
    fecha_fin:  any; 

  usuario: any;
    rol: any;
    identificacion: any; 
    datos_usuario: any;
  
    // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private service:  librosService, // <-- "service" obtiene los servicios proporcionados desde proyectores service -->
    private NgRouter: ActivatedRoute, // <-- "NgRouter", función de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->
    private NgNavigate: Router,
    private NgAlert: AlertController, // <-- "NgAlert", directiva de angular que muestra un mensaje emergente -->
  ) {}

      // <-- Es una función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista -->
  ngOnInit() {
      // <-- Esta sección llama los datos del Api Rest tomando en cuenta la categoria elegida -->
    let idc = this.NgRouter.snapshot.paramMap.get('idc');
    this.listar_libros(idc);
    this.ValidarDatos();
    console.log(this.fechaHoy)
  }

  
  async ValidarDatos(){
    try { 
      let token = await localStorage.getItem('token')
      if (token){
          // <-- Aqui estoy obteniendo los datos del usuario previamente guardados -->
        this.rol = localStorage.getItem('tipo_usuario')
        this.usuario = localStorage.getItem('usuario')
        this.identificacion = localStorage.getItem('identificacion')
      } else {this.NgNavigate.navigate(['/login'])}
    } catch (error){}
  }

  listar_libros(idc: any){
    this.service.Listar_Libros_Service(idc).subscribe( resp => {
      this.respuesta = resp
      this.libros = this.respuesta.datos;
      this.searchLibros = this.libros;

        // <------- Esta condicional valida si se obtuvieron datos de la categoria elegida ------->
          if (resp.confirm == false ){
            this.aviso = "false"
            this.titulo_cat = "😒" 
          } else { 
            this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria  
          }
        console.log(resp.datos)
      });
  }

    // <------- Esta función se encarga de filtrar los datos para dar como respuesta una coincidencia de la información obtenida -------------------->
  searchCustomer(event){
    const text = event.target.value;
    this.searchLibros = this.libros;

    if ( text && text.trim() != ''){
      this.searchLibros = this.searchLibros.filter((libros)=> {
        return (libros.Nombre_Elemento.toLowerCase().indexOf(text.toLowerCase()) > -1)
      })
    }
  }

  isModalOpen = false;
  openDetailBook(isOpen: boolean, idl: string = 'nothing') {
    this.isModalOpen = isOpen;
    this.service.Listar_Un_Libro(idl).subscribe( resp => {
      this.setLibro =  resp
      this.setAutor = ( this.setLibro.Autor)
      this.setNombre = ( this.setLibro.Nombre_Elemento)
      this.setImg = ( this.setLibro.Imagen)
      this.setDesc = ( this.setLibro.Descripcion)      
    })
  }

  // <------------- Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva --------------->
  async mostrarAlerta( msj: string ) {
    const alert = await this.NgAlert.create({ message: msj});
    await alert.present();
  }
      
      // <---------- Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable ---------->
  cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  }; 

  async ReservarLibro(){
    this.fecha = this.form.value.fecha
    this.fecha_fin = this.fecha.split("T",1)

    const todo: any = {fecha: this.fecha_fin[0], usuario: this.identificacion, serial: this.serial}
    
      // <----------- Este modulo recibe la respuesta del Api dependiendo si los datos son correctos o no ------------>
   
      this.service.Reservar_Libro(todo).subscribe(
      resp => {
        this.respuesta = (resp);
        this.boolean = (resp.confirm);
        if ( this.boolean == false) return this.mostrarAlerta('Lo siento, alguien ya reservo este libro');
      }
    )
  }


}