// src/app/core/models/auth.models.ts

// --- REQUESTS ---
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

// --- RESPONSES ---
export interface AuthResponse {
    token: string;
    type: string; // "Bearer"
    email: string;
    name: string;
}

export interface EstudianteProfileResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    carrera: string;
    ciclo: number;
    dni: string;
    distrito: string;
    universidad: string;
    urlFotoPerfil?: string;
}

export interface PropietarioProfileResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    dni: string;
    urlFotoPerfil?: string;
}
