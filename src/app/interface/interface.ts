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

//  Respuesta estandar del servidor
export interface Peticion_Interface {
    confirm: boolean;
    msj: string | null;
    cantidad: number;
    disponibles: number;
    datos: DatoElemento[];
}

// Estructura de la respuesta de los elementos desde el Api Rest
export interface DatoElemento extends DatoMovimiento {
    Pk_Elemento: string;
    Nombre_Elemento: string;
    Estado_Elemento: string;
    Imagen: null | string;
    Autor: string;
    Stock: number;
    Descripcion: null | string;
    Archivo_Aporte: null | string;
    Fk_Categoria: number | null;
    Categoria: Categoria;
    Tipo_Elemento: TipoElemento;
}

export interface Categoria {
    Pk_Categoria: number;
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
    Pk_Movimiento: number;
    Jornada_Reserva: string;
    Estado_Mv: string;
    Fecha_Inicio: string;
    Fecha_Fin: string;
    Otra_Fecha: string;
    Observacion: null;
    Fk_Usuario: number;
    Usuario: Usuario;
    Elemento: DatoElemento;
}

export interface Usuario {
    Nombre: string;
    Pk_Identificacion: number;
}
