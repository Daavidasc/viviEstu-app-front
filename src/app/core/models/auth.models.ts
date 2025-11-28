// Enums
export enum RoleType {
    ROLE_ESTUDIANTE = 'ROLE_ESTUDIANTE',
    ROLE_PROPIETARIO = 'ROLE_PROPIETARIO',
    ROLE_ADMIN = 'ROLE_ADMIN'
}

// Interfaces de Respuesta de Autenticación
export interface AuthResponse {
    token: string;
    email: string;
    name: string;
    role: RoleType;
    id: number;
}

// Interfaces de Petición (Requests)
export interface LoginRequest {
    correo: string;
    contrasenia: string;
}

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
