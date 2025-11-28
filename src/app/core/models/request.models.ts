export type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'AGENDADO';

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
    accommodationId?: number; // Para el estudiante ir al detalle
    title: string;            // Nombre alojamiento (estudiante) o Nombre estudiante (propietario)
    subtitle: string;         // Distrito (estudiante) o Universidad (propietario)
    image: string;            // Foto depa (estudiante) o Foto estudiante (propietario)
    status: EstadoSolicitud;
    statusColor: 'green' | 'yellow' | 'red' | 'gray';
    message?: string;
    date?: Date;
    price?: number;           // Oferta
}
