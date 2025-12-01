export interface StudentResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    carrera: string;
    ciclo: number;
    dni: string;
    distritoId: number;
    universidadId: number;
}

export interface LandlordResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    dni: string;
}
