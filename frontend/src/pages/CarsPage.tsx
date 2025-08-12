import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useCars } from '@/hooks/useCars';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { CarCard } from '@/components/CarCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CarFilters } from '@/types';

export function CarsPage() {
  const [filters, setFilters] = useState<CarFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: cars, isLoading, error } = useCars(filters);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const handleFilterChange = (key: keyof CarFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const brandOptions = brands?.map(brand => ({
    value: brand._id,
    label: brand.name,
  })) || [];

  const categoryOptions = categories?.map(category => ({
    value: category._id,
    label: category.name,
  })) || [];

  const fuelTypeOptions = [
    { value: 'Gasoline', label: 'Gasoline' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];

  const transmissionOptions = [
    { value: 'Manual', label: 'Manual' },
    { value: 'Automatic', label: 'Automatic' },
    { value: 'CVT', label: 'CVT' },
  ];

  const bodyTypeOptions = [
    { value: 'Sedan', label: 'Sedan' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Hatchback', label: 'Hatchback' },
    { value: 'Coupe', label: 'Coupe' },
    { value: 'Convertible', label: 'Convertible' },
    { value: 'Wagon', label: 'Wagon' },
    { value: 'Truck', label: 'Truck' },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-red-600">Failed to load cars. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Cars</h1>
          <p className="text-gray-600">
            {cars?.length || 0} cars available
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          
          <div className="flex border rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cars..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              placeholder="All Brands"
              options={brandOptions}
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />

            <Select
              placeholder="All Categories"
              options={categoryOptions}
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />

            <Select
              placeholder="Fuel Type"
              options={fuelTypeOptions}
              value={filters.fuelType || ''}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            />

            <Select
              placeholder="Transmission"
              options={transmissionOptions}
              value={filters.transmission || ''}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
            />

            <Select
              placeholder="Body Type"
              options={bodyTypeOptions}
              value={filters.bodyType || ''}
              onChange={(e) => handleFilterChange('bodyType', e.target.value)}
            />

            <Select
              placeholder="Min Year"
              options={yearOptions}
              value={filters.minYear?.toString() || ''}
              onChange={(e) => handleFilterChange('minYear', e.target.value ? parseInt(e.target.value) : '')}
            />

            <Select
              placeholder="Max Year"
              options={yearOptions}
              value={filters.maxYear?.toString() || ''}
              onChange={(e) => handleFilterChange('maxYear', e.target.value ? parseInt(e.target.value) : '')}
            />

            <Input
              placeholder="Min Price"
              type="number"
              value={filters.minPrice?.toString() || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : '')}
            />

            <Input
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice?.toString() || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : '')}
            />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Cars Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : cars && cars.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}