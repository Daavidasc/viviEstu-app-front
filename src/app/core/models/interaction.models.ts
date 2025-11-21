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
    estudianteNombre: string;
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
