import axios from 'axios';
import type { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User,
  Car,
  CreateCarRequest,
  Brand,
  Category,
  CarFilters
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/register', data).then(res => res.data),
  
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/login', data).then(res => res.data),
  
  logout: (): Promise<ApiResponse<null>> =>
    api.post('/auth/logout').then(res => res.data),
  
  getProfile: (): Promise<ApiResponse<User>> =>
    api.get('/auth/profile').then(res => res.data),
};

// Cars API
export const carsApi = {
  getCars: (filters?: CarFilters): Promise<ApiResponse<Car[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/cars?${params.toString()}`).then(res => res.data);
  },
  
  getCar: (id: string): Promise<ApiResponse<Car>> =>
    api.get(`/cars/${id}`).then(res => res.data),
  
  createCar: (data: CreateCarRequest): Promise<ApiResponse<Car>> =>
    api.post('/cars', data).then(res => res.data),
  
  updateCar: (id: string, data: Partial<CreateCarRequest>): Promise<ApiResponse<Car>> =>
    api.put(`/cars/${id}`, data).then(res => res.data),
  
  deleteCar: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/cars/${id}`).then(res => res.data),
};

// Brands API
export const brandsApi = {
  getBrands: (): Promise<ApiResponse<Brand[]>> =>
    api.get('/brands').then(res => res.data),
  
  getBrand: (id: string): Promise<ApiResponse<Brand>> =>
    api.get(`/brands/${id}`).then(res => res.data),
  
  createBrand: (data: { name: string; description?: string }): Promise<ApiResponse<Brand>> =>
    api.post('/brands', data).then(res => res.data),
  
  updateBrand: (id: string, data: { name?: string; description?: string }): Promise<ApiResponse<Brand>> =>
    api.put(`/brands/${id}`, data).then(res => res.data),
  
  deleteBrand: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/brands/${id}`).then(res => res.data),
};

// Categories API
export const categoriesApi = {
  getCategories: (): Promise<ApiResponse<Category[]>> =>
    api.get('/categories').then(res => res.data),
  
  getCategory: (id: string): Promise<ApiResponse<Category>> =>
    api.get(`/categories/${id}`).then(res => res.data),
  
  createCategory: (data: { name: string; description?: string }): Promise<ApiResponse<Category>> =>
    api.post('/categories', data).then(res => res.data),
  
  updateCategory: (id: string, data: { name?: string; description?: string }): Promise<ApiResponse<Category>> =>
    api.put(`/categories/${id}`, data).then(res => res.data),
  
  deleteCategory: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/categories/${id}`).then(res => res.data),
};

export default api;