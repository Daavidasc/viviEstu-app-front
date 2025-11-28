// Request
export interface ComentarioRequest {
    alojamientoId: number;
    estudianteId: number;
    contenido: string;
}

// Response
export interface ComentarioResponse {
    id: number;
    contenido: string;
    estudianteNombre: string;
    alojamientoTitulo: string;
}

// Response
export interface FavoritoResponse {
    id: number;
    alojamientoId: number;
    estudianteId: number;
}
