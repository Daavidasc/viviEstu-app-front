export interface PropietarioProfileResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    dni: string;
}

// Alias para facilitar uso en el frontend
export type LandlordProfile = PropietarioProfileResponse;

// Estadísticas del backend (basado en InteraccionReporteResponseDTO)
export interface AccommodationAnalyticsResponse {
    alojamientoId: number;
    nombreAlojamiento: string;
    totalInteracciones: number;
    estudiantesUnicos: number;
    ultimaInteraccion: string; // LocalDateTime como string
    universidadPrincipal: string; // universidad con más estudiantes
    distritoPrincipal: string; // distrito más frecuente
    promedioInteraccionesPorEstudiante: number;
}

// ViewModel para mostrar en la tabla del dashboard
export interface AccommodationAnalyticsViewModel {
    id: number;
    name: string;
    totalInteractions: number;
    uniqueStudents: number;
    lastInteraction: Date;
    topUniversity: string;
    topDistrict: string;
    avgInteractionsPerStudent: number;
    formattedLastInteraction: string;
}

// ViewModel para la tarjeta "Mis Alquileres" en el dashboard
export interface MyRentalViewModel {
    id: number;
    image: string;
    price: number;
    district: string;
    description: string;
    area: number;
    baths: number;
    rooms: number;
    clicks: number;
    requestsCount: number;
}
