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