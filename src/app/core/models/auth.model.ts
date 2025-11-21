export interface RegisterEstudianteRequest {
    nombre: string;
    apellidos: string;
    correo: string;
    contrasenia: string;
    telefono: string;
    carrera: string;
    ciclo: number;
    dni: string;
    distritoId: number;
    universidadId: number;
}

export interface RegisterPropietarioRequest {
    nombre: string;
    apellidos: string;
    correo: string;
    contrasenia: string;
    telefono: string;
    dni: string;
}

/** Modelo para las opciones de select (necesario para poblar los dropdowns) */
export interface SelectOption {
    value: number | string;
    label: string;
}

/** Modelos de respuesta para los datos de ubicación */
export interface DistrictDetailViewModel {
    id: number;
    nombre: string;
    urlImg: string;
    secondaryImage: string;
    seguridad: number;
    precioProm: number;
    universidades: string[]; // Nombres de universidades en la zona
    transportes: string[];
    descripcion: string;
    tipo: string;
}

export interface UniversidadResponse {
    id: number;
    nombre: string;
    distritoNombre: string;
}
