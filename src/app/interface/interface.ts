
    // <----------------- Mapeo de los datos del login para acceder ------------------->
export interface Login_Interface {
    user:             number;
    pass:             number;
    token:            string;
    booleano:         string;
}

    // <----------------- Mapear los proyectores que hay en la base de datos ------------------->
export interface Listar_Proyectores_Interface {
    Pk_Elemento:      string;
    Nombre_Elementos: string;
    Estado:             null;
    Tipo_Elemento:    string;
}

    // <----------------- Mapear las categorias de los libros de la base de datos ------------------->
export interface Listar_Categorias_Interface {
    Pk_Categorias:    number;
    Nombre_Categoria: string;
}

    // <----------------- Mapear los libros que hay en la base de datos ------------------->
export interface Listar_Libros_Interface {
    msj:              string;
    datos:            Dato[];
}

    // <----------------- Complemento del mapeo de los libros ------------------->
export interface Dato {
    Pk_Elemento:      string;
    Nombre_Elementos: string;
    Nombre_Categoria: string;
    Imagen:           string;
    Autor:            string;
    Descripcion:      string;
    Stock:            number;
}

    // <----------------- Mapeo de los datos que recive el Api Rest para reservar un computador ------------------->
export interface Reservar_Computador_Interface {
    usuario:          number; 
    cantidad:         number;
    joranadaReserva:  string; 
    fecha:            string;
    mensaje:          string;
}

    // <----------------- Mapeo de los datos que recive el Api Rest para reservar un ambiente ------------------->
export interface Reserva_Ambiente_Interface{
    fecha:            string;
    jornada:          string;
    usuario:          number;
    mensaje:          string; 
    datos:            string;
    boolean:          string; 
}

    // <-----------------  Mapeo de los datos que recive el Api Rest para reservar un proyector ------------------->
export interface Reserva_Proyector_Interface{
    fecha:            string;
    jornada:          string;
    usuario:          number;
    mensaje:          string; 
    datos:            string;
    boolean:          string; 
}