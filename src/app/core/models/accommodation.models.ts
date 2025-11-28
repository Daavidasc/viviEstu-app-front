// Sub-modelos
export interface ImagenDto {
    id: number;
    url: string;
}

export interface CoordenadasDto {
    latitude: number;
    longitude: number;
}

// Request para crear (Formulario)
export interface AlojamientoRequestForm {
    titulo: string;
    descripcion: string;
    direccion: string;
    precioMensual: number;
    nroPartida: string;
    alquilado: boolean;
    propietarioId: number;
    distritoId: number;
    transportes: string[];
    universidadesIds: number[];
    habitaciones?: number;
    banios?: number;
    area?: number;
    piso?: number;
    imagenes: File[]; // Para el FormData
}

// Response del Backend (Detalle completo)
export interface AlojamientoResponse {
    id: number;
    titulo: string;
    descripcion: string;
    direccion: string;
    precioMensual: number;
    alquilado: boolean;
    propietario: string; // Nombre del propietario
    distrito: string;
    nroPartida: string;
    fecha: string; // Timestamp
    imagenes: ImagenDto[];
    transportes: string[];
    universidades: string[];
    latitud: number;
    longitud: number;
    area: number;
    banios: number;
    habitaciones: number;
}

// ViewModel para Tarjetas (Búsqueda/Favoritos)
export interface AccommodationCardViewModel {
    id: number;
    thumbnailUrl: string;
    title: string;
    price: number;
    district: string;
    isFavorite: boolean;
    description?: string;
    universityNear?: string;
    area?: number;
    baths?: number;
    rooms?: number;
    isFeatured?: boolean;
}

// ViewModel para Detalle (Página de detalle)
export interface AccommodationDetailViewModel extends AlojamientoResponse {
    securityLevelLabel?: string;
    googleMapsUrl?: string;
    formattedDate: string;
    isFavorite?: boolean;
}
