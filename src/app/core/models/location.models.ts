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

// ViewModel para detalle de distrito (con extras)
export interface DistrictDetailViewModel extends DistritoResponse {
    secondaryImage?: string;
    universidades?: string[];
    transportes?: string[];
}

export interface UniversidadResponse {
    id: number;
    nombre: string;
    distritoNombre: string;
}
