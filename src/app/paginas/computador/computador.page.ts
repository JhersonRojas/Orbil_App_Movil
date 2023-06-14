import { Router } from '@angular/router'
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ComputadoresService } from '../../services/computador.service'
import { AlertController, IonModal, MenuController } from '@ionic/angular'
import { CheckTokenService } from 'src/app/middlewares/check-token.service'

@Component({
  selector: 'app-computador',
  templateUrl: './computador.page.html',
  styleUrls: ['./computador.page.scss'],
})

// Esta clase contiene las funciones y variables del modulo de computador
export class ComputadorPage implements OnInit {

  // Referencia al despliegue del Modal de computadores
  @ViewChild('modal', { static: true }) modal!: IonModal

  // Variables de los datos mostrados en el formulario
  selectedComputerText = '0 💻'
  selectedComputer: string[] = []

  usuario: string
  identificacion: string
  rol: string
  permiso_de_rango: boolean

  // Esta variable almacena la cantidad de computadores que envia el Api Rest
  computadores: any
  computadores_permiso: boolean = true
  computadores_muestra: any
  computadores_cantidad: string | number = '"Seleccionar fecha"'

  form: FormGroup // 'form' es la variable que guarda los datos recibidos de 'Fb' desde el HTML
  fecha_hoy: Date = new Date() // Esta variable recibe la fecha actual, esto es un componente propio de angular

  // Estas variables son las que tomara la función que mostrara un mensaje emergente en la vista al reservar
  mensaje: string
  confirm: boolean

  // Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable 'form'
  cantidad: number
  nombre: any
  fecha: string
  fecha_fin: any
  token: string

  // El constructor obtiene los parametros importados de diferentes componentes
  constructor(
    private service: ComputadoresService, // 'service' obtiene los servicios proporcionados desde ambiente service
    private valideAccess: CheckTokenService, // valideAccess obtiene la verificación del inicio de sesión
    private NgFb: FormBuilder, // 'FB' me proporciona una función propia de angular para agrupar información traida desde algun formulario del HTML
    private NgAlert: AlertController, // 'alert' es una componente de angular que me permite presentar ventanas emergentes con información en las vistas
    private NgMenu: MenuController,
    private NgRouter: Router,
  ) { }

  // Esta función es de angular, su contenido es lo primero que se ejecuta al entrar a esta vista
  ngOnInit() {
    this.confirmUser()
    // 'form' añade los datos en el momento que alguien diligencie el formulario en la vista
    this.form = this.NgFb.group({ fecha: ['', Validators.required] })
  }

  private confirmUser = () => {
    this.valideAccess.checkToken().subscribe(resp => {
      if (resp.confirm == true) {
        this.identificacion = this.valideAccess.setDataUser().identificacion
        this.usuario = this.valideAccess.setDataUser().usuario.split(' ')[0]
        this.rol = this.valideAccess.setDataUser().tipo_usuario

        this.rol == 'Administrador' || this.rol == 'Administrativo' || this.rol == 'Instructor' ?
          this.permiso_de_rango = true : this.permiso_de_rango = false
      }
    }, error => {
      if (error) {
        localStorage.clear()
        this.NgMenu.enable(false)
        setTimeout(() => this.NgRouter.navigate(['login']), 500)
      }
    })
  }

  // Esta función cancela la posibilidad de elegir fines de semana en el calendario desplegable
  public cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString)
    const utcDay = date.getUTCDay()
    return utcDay !== 0 && utcDay !== 6
  }

  // Esta función llama la cantidad e informacion de los computadores disponibles actualmente
  public filtradoPorDia = (event: any) => {
    this.fecha = (event.detail.value).split('T', 1)[0]
    this.service.Disponibles_Computador_Service(this.fecha).subscribe((resp) => {
      if (!resp.confirm) return (this.computadores_cantidad = 'No es valido!')
      if (resp.confirm) {
        this.computadores_muestra = resp.datos
        this.computadores_permiso = false
        return (this.computadores_cantidad = resp.cantidad)
      }
      return (this.computadores_cantidad = 'No se encuentran equipos')
    })
  }

  // Aqui cambia el valor de los computadores mostrados
  private formatData(data: string[]) {
    return `${data.length} 💻`
  }

  // Función para obtener la cantidad de computadores elegidos por el usuario
  public computerSelectionChanged = async (computer: string[]) => {
    this.selectedComputer = computer
    this.selectedComputerText = this.formatData(this.selectedComputer)
    await this.modal.dismiss()
  }

  // Esta función es la que me permite enviar un mensaje emergente al realizarse una reserva
  public mostrarAlerta = async (header: string, msj: string) => {
    const alert = await this.NgAlert.create({ header: header, message: msj })
    await alert.present()
  }

  // Es la primera verificación para confirmar la reserva del usuario
  public confirmReserve = async () => {
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
    })
    await alert.present()
    const confirm = await alert.onDidDismiss()
    if (confirm.role == 'confirm') return this.reserveComputer()
  }

  // Esta función se encarga de agrupar los datos y enviarlos por medio del servicio al Api Rest
  public reserveComputer = async () => {
    // Validacion de si elegieron algún computador
    if (this.selectedComputer.length == 0) {
      return this.mostrarAlerta('Cometio un error', 'Lo siento, debe elegir minimo un computador')
    }

    if (this.rol == 'Aprendiz' && this.selectedComputer.length > 1 || this.rol == 'Visitante' && this.selectedComputer.length > 1) {
      return this.mostrarAlerta('Permiso denegado', `Lo sentimos, siendo ${this.rol} no puede reservar mas de 1 computador`)
    }

    // Fecha a reservar de los computadores
    this.fecha = this.form.value.fecha
    this.fecha_fin = this.fecha.split('T', 1)[0]

    // Aqui se estan enviando los datos y recibiendo la respuesta del Api respecto a su validación
    let sendData: object = {
      usuario: this.identificacion,
      computadores: this.selectedComputer,
      fecha: this.fecha_fin
    }

    // Llamado al servicio para realziar la petición y hacer la reserva
    this.service.Reservar_Computador_Service(sendData).subscribe((response) => {
      this.filtradoPorDia({ detail: { value: this.fecha } })
      if (response.confirm == false) {
        this.mensaje = (response.msj)
        return this.mostrarAlerta('No se realizo la reserva', this.mensaje)
      } else {
        console.log(response);
        this.mensaje = !response.residuos ?
          `Se han reservado ${(response.cantidad)} computadores` :
          `Se han reservado ${(response.cantidad)} computadores, pero estos elementos ya estaban reservados: ${(response.residuos).toLocaleString()}, por lo tanto seran descartados`
        this.selectedComputer = []
        this.selectedComputerText = '0 💻'
        this.computadores_permiso = true
        // Mensaje al cliente despendendiendo de la respuesta del servidor 
        return this.mostrarAlerta('Se ha realizado la reserva', this.mensaje)
      }
    }, error => {
      if (error) return this.mostrarAlerta('Error de conexión', 'Lo sentimos, ha ocurrido un error de conexión, asegurese de estar en la red')
    })
  }
}
