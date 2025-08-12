// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message: string;
  status: string;
  timestamp?: string;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Car Types
export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  description: string;
  brand: Brand;
  category: Category;
  seller: User;
  isAvailable: boolean;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarRequest {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  description: string;
  brand: string;
  category: string;
}

// Brand Types
export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export interface CarFilters {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  search?: string;
}