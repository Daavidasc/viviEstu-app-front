import { AlojamientoResponse, DistritoResponse } from './accommodation.models';
import { PropietarioProfileResponse, EstudianteProfileResponse } from './auth.models';

export interface LandlordProfileViewModel extends PropietarioProfileResponse {
    fullName: string;
    age?: number;
    address?: string;
    propertiesCount?: number;
}

// Student ViewModels
export interface StudentProfileViewModel extends EstudianteProfileResponse {
    name: string; // Computed from nombre + apellidos
    university?: string;
    district?: string;
    career?: string;
    currentCycle?: number;
    avatarUrl?: string; // Mapped from urlFotoPerfil
    age?: number;
    preferredZone?: string;
    budget?: number;
}

export interface AccommodationCardViewModel {
    id: number;
    thumbnailUrl: string;
    title: string;
    price: number;
    district: string;
    isFavorite: boolean;
    score?: number;
    description?: string;
    isFeatured?: boolean;
    universityNear?: string;
    date?: Date;
    area?: number;
    baths?: number;
    rooms?: number;
}

export interface AccommodationDetailViewModel extends AlojamientoResponse {
    securityLevelLabel?: string;
    googleMapsUrl?: string;
    formattedDate: string;
    isFavorite?: boolean;
    estado?: string;
}

export interface DistrictDetailViewModel extends DistritoResponse {
    secondaryImage?: string;
    universidades?: string[];
    transportes?: string[];
    nivelSeguridad?: string;
}

// Landlord ViewModels
export interface LandlordRequestViewModel {
    id: number;
    requestId?: number; // Support both id and requestId
    accommodationTitle: string;
    applicantName: string;
    studentName?: string; // Support both applicantName and studentName
    status: 'reciente' | 'pendiente' | 'agendado'| 'rechazado';
    statusColor?: 'green' | 'yellow' | 'red' | 'gray';
    statusLabel?: string;
    requestDate?: Date;
    date?: Date; // Support both requestDate and date
    studentMessage?: string;
    message?: string; // Support both studentMessage and message
    studentPhotoUrl?: string;
    studentUniversity?: string;
}

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

export interface NewAccommodationViewModel {
    title: string;
    description: string;
    rooms: number | null;
    price: number | null;
    location: string;
    nearbyUniversities: string;
    roomiesAllowed: boolean;
    floor: number | null;
    images: File[];
}

export interface AccommodationStatsViewModel {
    viewsCount: number;
    favoritesCount: number;
    activeRequestsCount: number;
}

// Student ViewModels
export interface StudentRequestViewModel {
  requestId: number;
  alojamientoId: number; // 👈 ¡Añade esta línea!
  thumbnailUrl: string;
  price: number;
  district: string;
  status: string;
  statusColor: 'green' | 'yellow' | 'red' | 'gray';
  // ... otras propiedades si las tienes
}

export interface DistrictComparisonViewModel {
    distrito: DistritoResponse;
    securityClass: string;
    priceCategory: '$' | '$$' | '$$$';
}

export interface ContactFormViewModel {
    occupants: number | null;
    months: number | null;
    offer: number | null;
    message: string;
}
