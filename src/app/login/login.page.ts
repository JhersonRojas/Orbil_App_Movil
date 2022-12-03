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

export class LoginPage implements OnInit {

  form: FormGroup; // <-- "form" es la variable que guarda los datos recibidos de "FB" desde el HTML -->

  ingreso: any; // <-- Variable para guardar la función del acceso -->

  acceso: string; // <-- Variables donde se guarda los datos del usuario, estos se envian al Api Rest para ser validados -->
    identificacion: string;
    nombre: string;
    clave: string;
    tipo_usuario: string;

    // <-- Al enviarse los datos se recibe una respuesta, esta respuesta la almacenan estas variables -->
  public respuesta: any = [];
    boolean: string;
    token: string;

    // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private service: LoginService, /* "service" obtiene los datos proporcionados desde login service */
    private NgFb: FormBuilder, /* "NgFb", Componente de angular para agrupar información traida desde algun formulario del HTML */
    private NgRouter: Router, /* "NgRouter", Componente angular que me permite redirigir al usuario a otra ruta por medio de una orden */
    private NgMenu: MenuController, /* "NgMenu" me permite controlar el manejo del menu desplegable, como mostrarlo o no */
    private NgToast: ToastController, /* "NgToast", componente de angular que permite presentar ventanas emergentes con información en la vista*/
    ) {}

    // <-- Función de angular que se ejecuta al iniciarse esta pagina -->
  ngOnInit() {
    this.NgMenu.enable(false); // <-- Bloqueo del menú desplegable en esta vista -->
    this.checkToken(); // <-- Llamado a la función del Token -->
    this.form = this.NgFb.group({  // <--"form" añade los datos en el momento que alguien diligencie el formulario en la vista -->
      user: ['', Validators.required],
      pass: ['', Validators.required]
    });
  };

    // <-- Verificar el token, si existe uno en la App, enviara al usuario a la pagina siguiente -->
  checkToken(){
    if (localStorage.getItem('token'))
    { this.NgRouter.navigate(['/home']);}
  }

    // <-- El mensaje en caso de información no valida al acceder -->
  async ToastDeError(msj: string) {
    const toast = await this.NgToast.create({
      message: msj,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

    // <-- Función que envia los datos del formulario al Api Rest, cuando recibe una respuesta, permite o no acceder -->
  async ValidacionDeDatos( vis = "Visitante", apr = "Aprendiz", ins = "Instructor", adm = "Administrativo", fail= "false"){
    try{
      this.ingreso = this.service.Login_Service(this.form.value).subscribe(
        async resp => {
          this.respuesta = (resp.user);
          this.boolean = (resp.booleano);
          this.token = (resp.token);

            // <-- Esta condicional valida la respuesta, si es positiva deja acceder, si no, da un mensaje de acceso denegado -->
          if ( fail === this.boolean){ 
            this.respuesta = ""; 
            return this.ToastDeError("Contraseña o usuario incorrecto"); 
          } else {
              // <-- Se guardan los datos en el almacenamiento local desde aqui-->
            this.identificacion = this.respuesta[0].id_usuario,   
                localStorage.setItem('token', this.token);
            this.nombre = this.respuesta[0].Nombre,               
                localStorage.setItem('usuario', this.nombre);
            this.clave = this.respuesta[0].clave,                 
                localStorage.setItem('identificacion', this.identificacion);
            this.tipo_usuario = this.respuesta[0].tipo_usuario,   
                localStorage.setItem('tipo_usuario', this.tipo_usuario);

            // <-- De los datos recibidos toma el cargo y pasa a la siguiente vista -->
            if (this.tipo_usuario === apr, vis, ins, adm ){
              this.NgRouter.navigate(['/home'])
              //await location.reload()
            } else {
              return this.ToastDeError("El cargo no corresponde a este programa");
            }
          }
        }
      )
        return this.ingreso;  
    } 
    // <-- Si llega a ocurrir un error al tomarsew los datos, este lo mostrara por consola -->
    catch (error){ console.log(error) }
  } 
}