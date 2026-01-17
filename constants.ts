import { UserProfile } from './types';

// Mock Center (Sao Paulo region for demo)
export const DEFAULT_CENTER = { lat: -23.55052, lng: -46.633309 };

// Gamification Constants
export const XP_TO_LEVEL_UP = 100;
export const XP_PER_DELIVERY = 2;

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Carlos "Flash" Silva',
    type: 'motoboy',
    status: 'available',
    location: { lat: -23.552, lng: -46.635 },
    city: 'São Paulo',
    rating: 4.9,
    rank: 'diamond',
    xp: 85,
    vehicleType: 'Honda CG 160',
    minRate: 15,
    maxRate: 50,
    acceptsDailyRate: true,
    completedDeliveries: 1250,
    pixKey: 'carlos@flash.com'
  },
  {
    id: '2',
    name: 'Burger Kingo',
    type: 'restaurant',
    status: 'available',
    location: { lat: -23.548, lng: -46.638 },
    city: 'São Paulo',
    rating: 4.5,
    cuisine: 'Hamburgueria',
    address: 'Rua Augusta, 500',
    minRate: 10,
    maxRate: 100
  },
  {
    id: '3',
    name: 'João Entregas',
    type: 'motoboy',
    status: 'busy',
    location: { lat: -23.555, lng: -46.630 },
    city: 'São Paulo',
    rating: 4.7,
    rank: 'gold',
    xp: 45,
    vehicleType: 'Yamaha Fazer',
    minRate: 12,
    maxRate: 40,
    acceptsDailyRate: false,
    completedDeliveries: 420
  },
  {
    id: '4',
    name: 'Sushi House',
    type: 'restaurant',
    status: 'available',
    location: { lat: -23.558, lng: -46.632 },
    city: 'São Paulo',
    rating: 4.8,
    cuisine: 'Japonesa',
    address: 'Av Paulista, 1000'
  },
  {
    id: '5',
    name: 'Roberto Novato',
    type: 'motoboy',
    status: 'available',
    location: { lat: -23.545, lng: -46.628 },
    city: 'São Paulo',
    rating: 5.0,
    rank: 'bronze',
    xp: 10,
    vehicleType: 'Honda Biz',
    minRate: 10,
    maxRate: 30,
    acceptsDailyRate: true,
    completedDeliveries: 15
  },
  {
    id: '6',
    name: 'Pizza Veloce',
    type: 'restaurant',
    status: 'offline',
    location: { lat: -23.560, lng: -46.640 },
    city: 'São Paulo',
    rating: 4.2,
    cuisine: 'Pizzaria',
    address: 'Rua da Consolação, 300'
  }
];

export const RANK_COLORS = {
  bronze: 'text-orange-700 bg-orange-100 border-orange-300',
  silver: 'text-gray-600 bg-gray-100 border-gray-300',
  gold: 'text-yellow-700 bg-yellow-100 border-yellow-400',
  diamond: 'text-cyan-700 bg-cyan-100 border-cyan-400'
};

export const STATUS_COLORS = {
  available: 'bg-green-500',
  busy: 'bg-yellow-500',
  offline: 'bg-gray-400'
};