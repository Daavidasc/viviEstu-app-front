// src/app/core/models/accommodation.models.ts

// --- SUB-MODELOS ---
export interface ImagenDto {
    id: number;
    url: string;
}

export interface CoordenadasDto {
    latitude: number;
    longitude: number;
}

// --- REQUESTS ---
// Nota: Este modelo representa la estructura del formulario.
// IMPORTANTE: Al enviarlo al backend, el servicio DEBE convertirlo a FormData manualmente
// para manejar los archivos binarios (List<MultipartFile>) y los datos complejos.
// No se puede enviar como JSON directo.
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
    imagenes: File[];
}

export interface DistritoRequest {
    nombre: string;
    descripcion: string;
    precioProm: number;
    tipo: string;
    urlImg: string;
    seguridad: number;
}

export interface UniversidadRequest {
    nombre: string;
    distritoId: number;
}

export interface TransporteRequest {
    zonaId: number;
    nombre: string;
}

// --- RESPONSES ---
export interface AlojamientoResponse {
    id: number;
    titulo: string;
    descripcion: string;
    direccion: string;
    precioMensual: number;
    alquilado: boolean;
    propietario: string;
    distrito: string;
    nroPartida: string;
    fecha: string;
    imagenes: ImagenDto[];
    transportes: string[];
    universidades: string[];
    latitud: number;
    longitud: number;
    area: number;
    banios: number;
    habitaciones: number;
    servicios: string[];
}

export interface DistritoResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precioProm: number;
    tipo: string;
    urlImg: string;
    seguridad: number;
    lastUpdate?: string;
}

export interface UniversidadResponse {
    id: number;
    nombre: string;
    distritoNombre: string;
}
