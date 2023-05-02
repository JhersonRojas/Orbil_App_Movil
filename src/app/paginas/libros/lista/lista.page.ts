import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { librosService } from 'src/app/services/libros.service';
import { Dato } from 'src/app/interface/interface';
import { CheckTokenService } from 'src/app/middlewares/check-token.service';

@Component({
  selector: 'applista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})

// Esta clase contiene las distintas funciones y variables del modulo de la lista de los libros 
export class ListaPage implements OnInit {

  @ViewChild('anuncio', { static: true }) anuncio!: ElementRef

  header_libros: {} = {
    subHeader: 'Elige la categoria de los libros',
  };

  // Estas son las variables que almacenan la información obtenida del la categoria previamente elegida 
  libros: Dato[] = [];
  titulo_cat: string;
  searchLibros: any;
  categorias: any

  // Aqui se almacena el mensaje del Api Rest dependiendode su respuesta 
  respuesta: any;
  aviso: any;

  usuario: any;
  rol: any;
  identificacion: any;
  datos_usuario: any;
  token: string;

  // El constructor obtiene los parametros importados de diferentes componentes 
  constructor(
    private service: librosService, // "service" obtiene los servicios proporcionados desde proyectores service
    private valideAccess: CheckTokenService,
    private NgMenu: MenuController,
    private NgRouter: Router,
    private NgActiveRouter: ActivatedRoute, // "NgRouter", función de angular que me permite redirigir al usuario a otra ruta por medio de una orden 
    private NgAlert: AlertController, // "NgAlert", directiva de angular que muestra un mensaje emergente
  ) {
    this.saveDataUser()
  }

  // función de angular, su contenido es lo primero que se ejecuta al entrar a esta vista 
  ngOnInit() {
    // Esta sección llama los datos del Api Rest tomando en cuenta la categoria elegida 
    let idc = this.NgActiveRouter.snapshot.paramMap.get('idc');
    this.anuncio.nativeElement.setAttribute('style', 'display: none')
    this.listarCategorias();
    this.listar_libros(idc);
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

  handleRefresh(event) {
    let idc = this.NgActiveRouter.snapshot.paramMap.get('idc');
    setTimeout(() => {
      this.listar_libros(idc);
      event.target.complete();
    }, 2000);
  };

  private listar_libros = (idc: any) => {
    this.service.Listar_Libros_Service(idc).subscribe(resp => {
      this.respuesta = resp
      this.libros = this.respuesta.datos;
      this.searchLibros = this.libros;

      if (resp.confirm) return this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria
      this.aviso = "false"
      this.titulo_cat = "😒"
    });
  }

  private listarCategorias = () => {
    this.service.Listar_Categorias_Service().subscribe(resp => {
      this.categorias = (resp.datos)
    });
  }

  public filtrarLibros = (event: any) => {
    let idc = (event.detail.value);
    this.service.Listar_Libros_Service(idc).subscribe(resp => {
      this.respuesta = resp
      this.libros = this.respuesta.datos;
      this.searchLibros = this.libros;

      // Esta condicional valida si se obtuvieron datos de la categoria elegida
      if (!resp.confirm) {
        this.titulo_cat = "😒"
        this.anuncio.nativeElement.setAttribute('style', 'display: static')
      }

      if (resp.confirm) {
        this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria;
        this.anuncio.nativeElement.setAttribute('style', 'display: none')
      }
    });
  }

  // Esta función se encarga de filtrar los datos para dar como respuesta una coincidencia de la información obtenida 
  public searchCustomer = (event: any) => {
    const text = event.target.value;
    this.searchLibros = this.libros;

    if (text && text.trim() != '') {
      this.searchLibros = this.searchLibros.filter((libros) => {
        return (libros.Nombre_Elemento.toLowerCase().indexOf(text.toLowerCase()) > -1)
      })
    }
  }

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  public mostrarAlerta = async (msj: string) => {
    const alert = await this.NgAlert.create({ message: msj });
    await alert.present();
  }

  // Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable
  public cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };
}