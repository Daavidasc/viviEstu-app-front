export type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'AGENDADO'| 'NONE';

// Request al backend
export interface SolicitudRequest {
    mesesAlquiler: number;
    cantInquilinos: number;
    mensaje: string;
    oferta: number;
    estudiantesId: number;
    alojamientoId: number;
}

// Response del backend
export interface SolicitudResponse {
    id: number;
    mesesAlquiler: number;
    cantInquilinos: number;
    mensaje: string;
    oferta: number;
    estado: EstadoSolicitud;
    estudiantesId: number;
    nombreEstudiante: string;
    alojamientoId: number;
    tituloAlojamiento: string;
}

export interface ContactFormViewModel {
    occupants: number | null;
    months: number | null;
    offer: number | null;
    message: string;
}

// ViewModels (Cómo se ve en el Dashboard)
export interface RequestViewModel {
    requestId: number;
    accommodationId?: number;
    title: string;
    subtitle: string;
    image: string;
    status: EstadoSolicitud;
    statusColor: 'green' | 'yellow' | 'red' | 'gray';
    message?: string;
    date?: Date;

    // ✅ ASEGÚRATE DE TENER ESTOS 3 CAMPOS:
    price?: number;      // Oferta
    months?: number;     // Meses de alquiler
    occupants?: number;  // Cantidad de inquilinos
}
