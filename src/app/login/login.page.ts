import { Component, OnInit } from '@angular/core';
import { Validators,FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

// <---------- Esta clase es la encargada de contener las funciones y variables del modulo de login del la aplicación ------------->
export class LoginPage implements OnInit {

    // <----------------- "form" es la variable que guarda los datos recibidos de "Fb" desde el HTML ------------------->
  form: FormGroup;

    // <----------------- Funcion asincrona ------------------->
  ingreso: any; 

    // <----------------- Variables donde se guarda los datos del usuario, estos se envian al Api Rest para ser validados ------------------->
  acceso: string; 
      identificacion: string;
      nombre: string;
      clave: string;
      tipo_usuario: string;

    // <--------------- Al enviarse los datos se recibe una respuesta, esta respuesta la almacenan estas variables -------------------------->
  public respuesta: any = [];
    boolean: string;
    token: string;

      // <----------------- El constructor obtiene los parametros importados de diferentes componentes ------------------->
  constructor(
        // <----------------- "service" obtiene los servicios proporcionados desde login service ------------------->
    private service: LoginService,

      // <---- "FB" me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML ------>
    private FB: FormBuilder,
    
      // <--------- "route" es una función de angular que me permite redirigir al usuario a otra ruta por medio de una orden ----------->
    private router: Router,

      // <--------- "menu" me permite controlar el manejo del menu desplegable, como mostrarlo o no ----------->
    private menu: MenuController,

      // <--------- "alert" es una componente de angular que me permite presentar ventanas emergentes con información en las vistas ----------->
    private toastController: ToastController,) {}

    // <----------------- Función de angular que se ejecuta al iniciarse esta pagina ------------------->
  ngOnInit() {
      // <------------ Aqui es donde estoy cancelando el uso del menu en esta modulo-------------->
    this.menu.enable(false);

      // <----------------- "form" añade los datos en el momento que alguien diligencie el formulario en la vista ------------------->
    this.form = this.FB.group({
      user: ['', Validators.required],
      pass: ['', Validators.required]});
    this.checkToken();
  };

    // <------------- Verificar el token, si existe uno en la App, enviara al usuario a la pagina principal -------------->
  checkToken(){
    if (localStorage.getItem('token')){ this.router.navigate(['/home']);}
  }

    // <------------- El mensaje en caso de error al acceder -------------->
  async ToastDeError() {
    const toast = await this.toastController.create({
      message: 'Constraseña o usuario incorrecto',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

    // <------ Función que envia los datos del formulario al Api Rest, cuando recibe una respuesta deja o no acceder dependiendo de lo recibido --------->
  async ValidacionDeDatos( vis = "Visitante", apr = "Aprendiz", ins = "Instructor", adm = "Administrativo", bad= "false"){
    try{
      this.ingreso = this.service.Login_Service(this.form.value).subscribe(
        async resp => {
          this.respuesta = (resp.user);
          this.boolean = (resp.booleano);
          this.token = (resp.token);

            // <----------- Esta condicional valida la respuesta, si es positiva deja acceder, si no, da un mensaje de acceso denegado ---------------->
          if (bad == this.boolean) { this.respuesta = ""; return this.ToastDeError(); } 
          else {
            this.identificacion = this.respuesta[0].id_usuario;
            this.nombre = this.respuesta[0].Nombre;
            this.clave = this.respuesta[0].clave;
            this.tipo_usuario = this.respuesta[0].tipo_usuario;

              // <----------- Aqui guardo los datos del usuario retornados del Api Rest en caso de un acceso exitoso -------------->
            localStorage.setItem('token', this.token);
            localStorage.setItem('usuario', this.nombre);
            localStorage.setItem('identificacion', this.identificacion);
            localStorage.setItem('tipo_usuario', this.tipo_usuario);

            // <------- En esta condicional valido que tipo de ccargo tiene el usuario para pasarlo a la siguiente vista ----------->
            switch (this.tipo_usuario) {
              case apr:
                this.router.navigate(['/home'])
                await location.reload()
                break;
              case vis:
                this.router.navigate(['/home'])
                await location.reload()
                break;
              case ins:
                this.router.navigate(['/home'])
                await location.reload()
                break;
              case adm:
                this.router.navigate(['/home'])
                await location.reload()
                break;
            }
          }
        }
      )
        return this.ingreso;  
    } 
    // <-------------- Si llega a ocurrir un error al tomarsew los datos, este lo mostrara por consola --------------------->
    catch (error){ console.log(error) }

  }
  
}
