// src/app/core/models/interaction.models.ts

// --- TYPES ---
export type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'AGENDADO';

// --- REQUESTS ---
export interface SolicitudRequest {
    mesesAlquiler: number;
    cantInquilinos: number;
    mensaje: string;
    oferta: number;
    estudiantesId: number;
    alojamientoId: number;
}

export interface ComentarioRequest {
    alojamientoId: number;
    estudianteId: number;
    contenido: string;
    puntuacion: number; // 1-5 estrellas
}

export interface InteraccionRequest {
    alojamientoId: number;
    estudianteId: number;
    fecha: string;
}

export interface FavoritoRequest {
    alojamientoId: number;
    estudianteId: number;
}

// --- RESPONSES ---
export interface SolicitudResponse {
    id: number;
    mesesAlquiler: number;
    cantInquilinos: number;
    mensaje: string;
    oferta: number;
    estado: EstadoSolicitud; // Tipo estricto
    estudiantesId: number;
    nombreEstudiante: string;
    alojamientoId: number;
    tituloAlojamiento: string;
}

export interface ComentarioResponse {
    id: number;
    contenido: string;
    puntuacion: number; // 1-5 estrellas
    fecha: string; // ISO format
    estudianteId: number;
    estudianteNombre: string;
    alojamientoId: number;
    alojamientoTitulo: string;
}

export interface InteraccionResponse {
    id: number;
    alojamientoId: number;
    estudianteId: number;
    fecha: string;
}

export interface FavoritoResponse {
    id: number;
    alojamientoId: number;
    estudianteId: number;
}
