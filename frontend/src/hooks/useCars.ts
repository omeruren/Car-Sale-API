import { useQuery } from '@tanstack/react-query';
import { carsApi } from '@/api';
import type { CarFilters } from '@/types';

export function useCars(filters?: CarFilters) {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: () => carsApi.getCars(filters),
    select: (data) => data.data || [],
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ['cars', id],
    queryFn: () => carsApi.getCar(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}