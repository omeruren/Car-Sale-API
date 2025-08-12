import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    select: (data) => data.data || [],
  });
}