import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController, MenuController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { CheckTokenService } from '../middlewares/check-token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  // <-- "form" variable que guarda los datos recibidos de "NgFb" desde el HTML -->
  public form: FormGroup;

  // datos recibidos del Api (solo una formalidad)
  private identificacion: string;
  private nombre: string;
  private tipo_usuario: string;

  // <-- Al enviarse los datos se recibe una respuesta, esta respuesta la almacenan estas variables -->
  private token: string;

  // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private valideAccess: CheckTokenService,
    private service: LoginService, /* "service" obtiene los datos proporcionados desde services/login.service */
    private NgFb: FormBuilder, /* "NgFb", Componente de angular para agrupar información traida desde algun formulario del HTML */
    private NgRouter: Router, /* "NgRouter", Componente angular que me permite redirigir al usuario a otra ruta por medio de una orden */
    private NgMenu: MenuController, /* "NgMenu" me permite controlar el manejo del menú desplegable, como mostrarlo o no */
    private NgToast: ToastController, /* "NgToast", componente de angular que permite presentar ventanas emergentes con información en la vista*/
    private NgLoading: LoadingController,
  ) {
    this.NgMenu.enable(false);
  }

  // <-- Función de angular que se ejecuta al iniciarse esta pagina -->
  ngOnInit() {
    this.confirmUser();
    this.form = this.NgFb.group({  // <--"NgFb.group()" añade los datos en el momento que alguien diligencie el formulario en la vista -->
      user: ['', Validators.required],
      pass: ['', Validators.required]
    });
  };

  // confirmación si hay un usuario vigente
  private confirmUser = () => {
    if (localStorage.getItem('token')) {
      this.valideAccess.checkToken().subscribe(resp => {
        resp.confirm == true ? this.NgRouter.navigate(["/home"]) : localStorage.clear();
      });
    }
  }

  // <-- Mensaje en caso de querer acceder -->
  public msjToast = async (msj: string) => {
    const toast = await this.NgToast.create({
      message: msj,
      duration: 2500,
      position: 'bottom',
      mode: 'ios',
    });
    toast.present();
  }

  // mensaje de cargando que dura un tiempo
  showLoading = async () => {
    const loading = await this.NgLoading.create({
      message: 'Iniciando sesión...',
      duration: 800,
    });
    loading.present();

    setTimeout(() => {
      this.NgMenu.enable(true)
      this.NgRouter.navigate(["/home"])
    }, 900);
  }

  // <-- Función que envia los datos del formulario al servidor para su validación -->
  public ValidacionDeDatos = () => {
    this.service.Login_Service(this.form.value).subscribe(resp => {

      if (resp.confirm === false) {
        return this.msjToast('Usuario o Contraseña incorrecto')
      }

      if (resp.confirm === true) {

        this.token = (resp.token);

        // almacenando los datos de la respuesta localmente
        resp.user.Pk_Identificacion_SIREP ?
          localStorage.setItem('identificacion', resp.user.Pk_Identificacion_SIREP) :
          this.identificacion = undefined

        resp.user.Nombre_SIREP ?
          localStorage.setItem('usuario', resp.user.Nombre_SIREP) :
          this.nombre = undefined

        resp.user.Tipo_Usuario_SIREP ?
          localStorage.setItem('tipo_usuario', resp.user.Tipo_Usuario_SIREP) :
          this.tipo_usuario = undefined

        localStorage.setItem('token', this.token)
        this.showLoading()
      }
    }, error => {
      if (error) return this.msjToast('No se encuentra conectado al servidor')
    })
  }

  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;
  // Seleccionamos el elemento con el nombre que le pusimos con el #
  passwordTypeInput = 'password';
  // Variable para cambiar dinamicamente el tipo de Input que por defecto sera 'password'

  // Esta función verifica si el tipo de campo es texto lo cambia a password y viceversa, además verificara el icono si es 'eye-off' lo cambiara a 'eye' y viceversa
  togglePasswordMode() {
    //cambiar tipo input
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    //obtener el input
    const nativeEl = this.passwordEye.nativeElement.querySelector('input');
    //obtener el indice de la posición del texto actual en el input
    const inputSelection = nativeEl.selectionStart;
    //ejecuto el focus al input
    nativeEl.focus();
    //espero un milisegundo y actualizo la posición del indice del texto
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);

  }

}