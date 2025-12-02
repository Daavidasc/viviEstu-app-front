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
