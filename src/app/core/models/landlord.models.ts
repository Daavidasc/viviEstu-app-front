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
