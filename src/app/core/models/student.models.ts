export interface UserProfile {
  id: number;
  name: string;
  university: string;
  preferredDistrict: string;
  avatarUrl?: string;
}

export interface Accommodation {
  id: number;
  image: string;
  price: number;
  district: string;
  description: string;
  area: number;
  baths: number;
  rooms: number;
  isFavorite: boolean;
  isFeatured?: boolean;
  universityNear?: string;
}

export interface AccommodationDetail extends Accommodation {
  title: string;
  images: string[];
  address: string;
  nearbyUniversities: string[];
  mobilityOptions: string[];
}

export interface ContactForm {
  occupants: number | null;
  months: number | null;
  offer: number | null;
  message: string;
}

export interface StudentProfile {
  id?: number;
  name?: string;
  fullName: string;
  email: string;
  dni: string;
  phone: string;
  age: number;
  preferredZone: string;
  preferredDistrict?: string;
  budget: string;
  university: string;
  semester: number;
  career: string;
  avatarUrl?: string;
}

export interface ActiveRequest {
  id: number;
  image: string;
  price: number;
  district: string;
  status: 'Pendiente' | 'Aceptada' | 'Rechazada';
}

export interface Zone {
  id: number;
  name: string;
  image: string;
}
