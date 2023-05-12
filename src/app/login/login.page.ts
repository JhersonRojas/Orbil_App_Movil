import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { CheckTokenService } from '../middlewares/check-token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  public form: FormGroup; // <-- "form" variable que guarda los datos recibidos de "NgFb" desde el HTML -->

  public acceso: string; // <-- Variables donde se guarda los datos del usuario, estos se envian al Api Rest para ser validados -->
  private identificacion: string;
  private nombre: string;
  public clave: string;
  private tipo_usuario: string;

  // <-- Al enviarse los datos se recibe una respuesta, esta respuesta la almacenan estas variables -->
  public respuesta: any = [];
  private token: string;

  // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private valideAccess: CheckTokenService,
    private service: LoginService, /* "service" obtiene los datos proporcionados desde services/login.service */
    private NgFb: FormBuilder, /* "NgFb", Componente de angular para agrupar información traida desde algun formulario del HTML */
    private NgRouter: Router, /* "NgRouter", Componente angular que me permite redirigir al usuario a otra ruta por medio de una orden */
    private NgMenu: MenuController, /* "NgMenu" me permite controlar el manejo del menú desplegable, como mostrarlo o no */
    private NgToast: ToastController, /* "NgToast", componente de angular que permite presentar ventanas emergentes con información en la vista*/
  ) { this.NgMenu.enable(false); }

  // <-- Función de angular que se ejecuta al iniciarse esta pagina -->
  ngOnInit() {
    this.saveDataUser(); // <-- Llamado a la función que valida si hay o no Token -->
    this.form = this.NgFb.group({  // <--"NgFb.group()" añade los datos en el momento que alguien diligencie el formulario en la vista -->
      user: ['', Validators.required],
      pass: ['', Validators.required]
    });
  };

  private saveDataUser = () => {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      this.NgMenu.enable(false)
      localStorage.clear()
      setTimeout(() => {
        this.NgRouter.navigate(['/login']);
      }, 100);
    }

    else {
      this.valideAccess.checkToken(this.token).subscribe(resp => {
        if (resp.confirm == true) {
          this.identificacion = localStorage.getItem('identificacion');
          setTimeout(() => {
            this.NgRouter.navigate(['/home']);
          }, 100);
        }
      }, error => {
        if (error.error.confirm) {
          this.NgMenu.enable(false)
          localStorage.clear()
          setTimeout(() => {
            this.NgRouter.navigate(['/login']);
          }, 1000);
        }
      });
    }
  }

  // <-- Mensaje en caso de querer acceder -->
  async msjToast(msj: string) {
    const toast = await this.NgToast.create({
      message: msj,
      duration: 2500,
      position: 'bottom',
      mode: 'ios',
    });
    toast.present();
  }

  // <-- Función que envia los datos del formulario al servidor para su validación -->
  async ValidacionDeDatos() {
    try {
      this.service.Login_Service(this.form.value).subscribe(resp => {

        if (!resp) return this.msjToast('No se encuentra conectado al servidor')
        if (!resp.confirm) return this.msjToast('Usuario o Contraseña incorrecto')

        if (resp.confirm == true) {
          this.respuesta = (resp)
          this.token = (resp.token);
  
          this.identificacion = this.respuesta.user.Pk_Identificacion_SIREP
          localStorage.setItem('identificacion', this.identificacion);
  
          this.nombre = this.respuesta.user.Nombre_SIREP
          localStorage.setItem('usuario', this.nombre);
  
          this.tipo_usuario = this.respuesta.user.Tipo_Usuario_SIREP
          localStorage.setItem('tipo_usuario', this.tipo_usuario);
  
          localStorage.setItem('token', this.token);
          
          this.NgRouter.navigateByUrl('/home', { skipLocationChange: true }).then(() => this.NgRouter.navigate(["/home"]));
          this.NgMenu.enable(true)
          
          if (this.token) {
            setTimeout(() => {
              location.reload();
            }, 700);
          }
        }
      })

    } catch (error) {
      console.log('error :>> \n ', error);
    }
  }
}