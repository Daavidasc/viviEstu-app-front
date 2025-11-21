export interface EstudianteResponseDTO {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    carrera: string;
    ciclo: number;
    dni: string;
    distrito: string; // Nombre del Distrito
    universidad: string; // Nombre de la Universidad
}

// NUEVO DTO (de FavoritosController)
export interface FavoritosResponseDTO {
    id: number;
    alojamientoId: number;
    estudianteId: number;
    // NOTA: Para el dashboard, probablemente querrás los detalles del alojamiento.
    // Necesitamos mapear esto con el AlojamientoService para obtener los detalles de la tarjeta.
}

// NUEVO DTO (de SolicitudController)
export interface SolicitudResponseDTO {
    id: number;
    mesesAlquiler: number;
    cantInquilinos: number;
    mensaje: string;
    oferta: number;
    estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | string; // Asegurar que coincida con BE
    estudiantesId: number;
    nombreEstudiante: string;
    alojamientoId: number;
    tituloAlojamiento: string;
}

export interface EstudiantesRequestDTO {
    nombre: string;
    apellidos: string;
    correo: string;
    contrasenia: string;
    dni: string;
    telefono: string;
    ciclo: number;
    carrera: string;
    universidadId: number;
    distritoId: number;
}

// DTOs para AlojamientoService
export interface ImagenResponseDTO {
    id: number;
    url: string;
}

export interface AlojamientoResponseDTO {
    id: number;
    titulo: string;
    descripcion: string;
    direccion: string;
    precioMensual: number; // BigDecimal se mapea a number en TS
    alquilado: boolean;
    propietario: string; // Nombre del Propietario
    distrito: string; // Nombre del Distrito
    nroPartida: string;
    fecha: string; // Timestamp se mapea a string (fecha ISO)
    imagenes: ImagenResponseDTO[];
    transportes: string[];
    universidades: string[];
    latitud: number;
    longitud: number;
}

export interface AlojamientoRequestDTO {
    titulo: string;
    descripcion: string;
    direccion: string;
    precioMensual: number;
    nroPartida: string;
    distritoId: number;
    propietarioId: number;
    transportes?: string[];
    universidadesIds?: number[];
    // NOTA: 'imagenes' (MultipartFile[]) no se gestiona directamente aquí
    // El componente que llama a este service debe usar FormData.
}

export interface PropietariosResponseDTO {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    dni: string;
}
