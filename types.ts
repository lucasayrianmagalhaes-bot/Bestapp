export type UserType = 'motoboy' | 'restaurant' | 'visitor';
export type Status = 'available' | 'busy' | 'offline';
export type Rank = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Location {
  lat: number;
  lng: number;
}

export interface DeliveryHistory {
  id: string;
  restaurantName: string;
  date: string; // ISO date
  value: number;
  distance: string;
}

export interface UserProfile {
  id: string;
  name: string;
  type: UserType;
  status: Status;
  location: Location;
  city: string;
  rating: number;
  
  // Motoboy specific
  rank?: Rank;
  xp?: number; // 0 to 100
  vehicleType?: string;
  minRate?: number;
  maxRate?: number;
  acceptsDailyRate?: boolean; // If they accept full day work
  completedDeliveries?: number;
  walletBalance?: number; // Current balance
  history?: DeliveryHistory[]; // List of past deliveries
  
  // Restaurant specific
  cuisine?: string;
  address?: string;

  // Contact (Hidden for visitors)
  phone?: string;
  pixKey?: string;
}

export interface FilterState {
  showMotoboys: boolean;
  showRestaurants: boolean;
  minRank: Rank | 'all';
  onlyAvailable: boolean;
  maxDistance: number; // In Kilometers
  onlyDailyRate: boolean; // Filter for daily rate
  priceRange: {
    min: number;
    max: number;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'alert';
  timestamp: number;
}