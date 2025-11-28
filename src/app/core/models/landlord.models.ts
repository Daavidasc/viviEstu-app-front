// DTO del Backend
export interface PropietarioProfileResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    dni: string;
    urlFotoPerfil?: string;
}

// ViewModel (Para el Dashboard del Propietario)
export interface LandlordProfileViewModel extends PropietarioProfileResponse {
    fullName: string;
    age?: number;
    address?: string;
    propertiesCount?: number;
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
