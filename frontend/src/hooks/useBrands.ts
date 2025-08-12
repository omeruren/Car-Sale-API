import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '@/api';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getBrands(),
    select: (data) => data.data || [],
  });
}