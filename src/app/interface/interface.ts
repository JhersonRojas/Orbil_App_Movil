// Mapeo de los datos del login para acceder
export interface Login_Interface {
    confirm: boolean;
    msj: string;
    user: User;
    token: string;
}

export interface User {
    Pk_Identificacion_SIREP: string;
    Nombre_SIREP: string;
    Tipo_Usuario_SIREP: string;
}

//  Respuesta general del Api
export interface Peticion_Interface {
    confirm: boolean;
    msj: string | null;
    cantidad: number;
    disponibles: number;
    datos: DatoElemento[];
}

// Estructura de la respuesta de los elementos desde el Api Rest
export interface DatoElemento extends DatoMovimiento {
    Archivo_Aporte: null | string;
    Autor: string;
    Descripcion: null | string;
    Estado_Elemento: string;
    Fk_Categoria: number | null;
    Imagen: null | string;
    Nombre_Elemento: string;
    Pk_Elemento: string;
    Stock: number;
    Categoria: Categoria;
    Tipo_Elemento: TipoElemento;
}

export interface Categoria {
    Nombre_Categoria: string;
}

export enum TipoElemento {
    Ambiente = "Ambiente",
    Computador = "Computador",
    Libros = "Libros",
    Proyector = "Proyector",
}

// Respuesta del lado de los movimientos 
export interface DatoMovimiento {
    Estado_Mv: string;
    Fecha_Inicio: string;
    Fk_Usuario: number;
    Jornada_Reserva: string;
    Observacion: null;
    Otra_Fecha: string;
    Pk_Movimiento: number;
    Usuario: Usuario;
    Elemento: Elemento;

}

export interface Usuario {
    Nombre: string;
    Pk_Identificacion: number;
}

export interface Elemento {
    Imagen: string;
    Nombre_Elemento: string;
    Tipo_Elemento: string;
}
