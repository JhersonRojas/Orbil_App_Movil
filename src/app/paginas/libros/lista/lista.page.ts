import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatoElemento } from 'src/app/interface/interface';
import { librosService } from 'src/app/services/libros.service';
import { AlertController, MenuController } from '@ionic/angular';
import { CheckTokenService } from 'src/app/middlewares/check-token.service';

@Component({
  selector: 'applista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})

// Esta clase contiene las distintas funciones y variables del modulo de la lista de los libros
export class ListaPage implements OnInit {
  header_libros: {} = {
    subHeader: 'Elige la categoria de los libros',
  };

  // Estas son las variables que almacenan la información obtenida del la categoria previamente elegida
  libros: DatoElemento[] = [];
  titulo_cat: string;
  searchLibros: any;
  categorias: any;

  // Aqui se almacena el mensaje del Api Rest dependiendode su respuesta
  noBooks: boolean = true;

  // se guardan los datos del usuario para hacer las reservas
  token: string;
  identificacion: string;
  datos_usuario: string;
  usuario: string;
  rol: string;

  // El constructor obtiene los parametros importados de diferentes componentes
  constructor(
    private service: librosService, // "service" obtiene los servicios proporcionados desde proyectores service
    private valideAccess: CheckTokenService,
    private NgActiveRouter: ActivatedRoute, // "NgRouter", función de angular que me permite redirigir al usuario a otra ruta por medio de una orden
    private NgRouter: Router,
    private NgMenu: MenuController,
    private NgAlert: AlertController // "NgAlert", directiva de angular que muestra un mensaje emergente
  ) { }

  // función de angular, su contenido es lo primero que se ejecuta al entrar a esta vista
  ngOnInit() {
    this.confirmUser();
    let idc = this.NgActiveRouter.snapshot.paramMap.get('idc');
    this.listarCategorias();
    this.listar_libros(idc);
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

  // Esta función se encarga de filtrar los datos para dar como respuesta una coincidencia de la información obtenida
  public searchCustomer = (event: any) => {
    const text = event.target.value;
    this.searchLibros = this.libros;

    if (text && text.trim() != '') {
      this.searchLibros = this.searchLibros.filter((libros: any) => {
        return libros.Nombre_Elemento.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
    }
  };

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  public mostrarAlerta = async (msj: string) => {
    const alert = await this.NgAlert.create({ message: msj });
    await alert.present();
  };

  // Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable
  public cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  handleRefresh(event: any) {
    let idc = this.NgActiveRouter.snapshot.paramMap.get('idc');
    setTimeout(() => {
      this.listar_libros(idc);
      event.target.complete();
    }, 2000);
  }

  private listar_libros = (idc: any) => {
    this.service.Listar_Libros_Service(idc).subscribe((resp) => {
      this.libros = resp.datos;
      this.searchLibros = this.libros;
      if (resp.confirm == true) {
        this.noBooks = false;
        return this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria;
      } else {
        this.noBooks = true;
        this.titulo_cat = '😒';
      }
    });
  };

  private listarCategorias = () => {
    this.service.Listar_Categorias_Service().subscribe((resp) => {
      this.categorias = resp.datos.slice(2, resp.datos.length);
    });
  };

  public filtrarLibros = (event: any) => {
    let idc = event.detail.value;
    this.service.Listar_Libros_Service(idc).subscribe((resp) => {
      this.libros = resp.datos;
      this.searchLibros = this.libros;

      // Esta condicional valida si se obtuvieron datos de la categoria elegida
      if (!resp.confirm) {
        this.noBooks = true;
        this.titulo_cat = '😒';
      } else {
        this.noBooks = false;
        this.titulo_cat = this.libros[0].Categoria.Nombre_Categoria;
      }
    });
  };
}
