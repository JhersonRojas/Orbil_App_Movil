import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { librosService } from 'src/app/services/libros.service';
import { Dato } from 'src/app/interface/interface';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})

  // <-- Esta clase contiene las distintas funciones y variables del modulo de la lista de los libros -->
export class ListaPage implements OnInit {

  @ViewChild('anuncio',{ static: true})anuncio!: ElementRef

  header_libros: {} = {
    subHeader: 'Elige la categoria de los libros',
  };

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

  categorias: any

    // <-- Aqui se almacena el mensaje del Api Rest dependiendode su respuesta -->
  respuesta:         any;
    aviso:           any;
    boolean:     boolean;

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
    this.anuncio.nativeElement.setAttribute('style', 'display: none')
    this.ValidarDatos();
    this.listar_categorias();
    this.listar_libros(idc);
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
      } 
      else this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria  
    });
  }

  listar_categorias(){
    this.service.Listar_Categorias_Service().subscribe(
      resp => {
          this.categorias = resp
      });
  }

  filtrar(e: any) {
    let idc = (e.detail.value);
    this.service.Listar_Libros_Service(idc).subscribe( resp => {
      this.respuesta = resp
      this.libros = this.respuesta.datos;
      this.searchLibros = this.libros;

        // <------- Esta condicional valida si se obtuvieron datos de la categoria elegida ------->
      if (resp.confirm == false ){
        this.titulo_cat = "😒"
        this.anuncio.nativeElement.setAttribute('style', 'display: static')
      } 
      this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria;
      this.anuncio.nativeElement.setAttribute('style', 'display: none')
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
}