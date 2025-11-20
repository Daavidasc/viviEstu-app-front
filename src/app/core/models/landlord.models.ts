export interface RequestItem {
  id: number;
  accommodationTitle: string;
  applicantName: string;
  status: 'reciente' | 'pendiente' | 'agendado';
}

export interface MyRentalItem {
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

export interface NewAccommodation {
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

export interface LandlordProfile {
  fullName: string;
  email: string;
  dni: string;
  phone: string;
  age: number;
  address: string;
  propertiesCount: number;
}
