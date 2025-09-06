// Types สำหรับแอปจัดทริปท่องเที่ยวไทย

export interface Province {
  id: string;
  name: string;
  name_en: string;
  region: string;
  description: string;
  image_url: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Attraction {
  id: string;
  province_id: string;
  name: string;
  name_en: string;
  type: 'temple' | 'waterfall' | 'market' | 'landmark' | 'beach' | 'mountain' | 'museum' | 'park';
  description: string;
  image_url: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  estimated_duration: number; // ชั่วโมง
  entrance_fee: number;
  opening_hours: string;
}

export interface Food {
  id: string;
  province_id: string;
  name: string;
  name_en: string;
  type: 'local_dish' | 'dessert' | 'snack' | 'drink';
  description: string;
  image_url: string;
  price_range: {
    min: number;
    max: number;
  };
  recommended_places: string[];
}

export interface Activity {
  id: string;
  province_id: string;
  name: string;
  name_en: string;
  type: 'diving' | 'hiking' | 'rafting' | 'cycling' | 'cultural' | 'adventure' | 'relaxation';
  description: string;
  image_url: string;
  duration: number; // ชั่วโมง
  difficulty_level: 'easy' | 'medium' | 'hard';
  price_range: {
    min: number;
    max: number;
  };
  season: string;
}

export interface TripItem {
  id: string;
  type: 'attraction' | 'food' | 'activity';
  item: Attraction | Food | Activity;
  day: number;
  order: number;
  notes?: string;
}

export interface Trip {
  id: string;
  name: string;
  province_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  items: TripItem[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
  share_code?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  ProvinceSelection: undefined;
  ProvinceDetail: { provinceId: string };
  MyTrips: undefined;
  TripDetail: { tripId: string };
  CreateTrip: { provinceId: string };
  SharedTrip: { shareCode: string };
};

export type BottomTabParamList = {
  Explore: undefined;
  MyTrips: undefined;
  Profile: undefined;
};