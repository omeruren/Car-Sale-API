import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Car, Upload, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { carsApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CreateCarRequest } from '@/types';

const carSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year'),
  price: z.number().min(1, 'Price must be greater than 0'),
  mileage: z.number().min(0, 'Mileage cannot be negative'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  bodyType: z.string().min(1, 'Body type is required'),
  color: z.string().min(1, 'Color is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
});

type CarForm = z.infer<typeof carSchema>;

export function CreateCarPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CarForm>({
    resolver: zodResolver(carSchema),
  });

  const createCarMutation = useMutation({
    mutationFn: (data: CreateCarRequest) => carsApi.createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      navigate('/profile?tab=cars');
    },
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const onSubmit = (data: CarForm) => {
    const carData: CreateCarRequest = {
      ...data,
      year: Number(data.year),
      price: Number(data.price),
      mileage: Number(data.mileage),
    };
    createCarMutation.mutate(carData);
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

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      return axiosError.response?.data?.message || 'Failed to create listing. Please try again.';
    }
    return 'Failed to create listing. Please try again.';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Car className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Car</h1>
        <p className="text-gray-600">Create a listing to sell your car quickly and easily</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Brand *"
              placeholder="Select brand"
              options={brandOptions}
              error={errors.brand?.message}
              {...register('brand')}
            />

            <Select
              label="Category *"
              placeholder="Select category"
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category')}
            />

            <Input
              label="Make *"
              placeholder="e.g. Toyota, Honda, BMW"
              error={errors.make?.message}
              {...register('make')}
            />

            <Input
              label="Model *"
              placeholder="e.g. Camry, Civic, X5"
              error={errors.model?.message}
              {...register('model')}
            />

            <Select
              label="Year *"
              placeholder="Select year"
              options={yearOptions}
              error={errors.year?.message}
              {...register('year', { valueAsNumber: true })}
            />

            <Input
              label="Color *"
              placeholder="e.g. Black, White, Red"
              error={errors.color?.message}
              {...register('color')}
            />
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Fuel Type *"
              placeholder="Select fuel type"
              options={fuelTypeOptions}
              error={errors.fuelType?.message}
              {...register('fuelType')}
            />

            <Select
              label="Transmission *"
              placeholder="Select transmission"
              options={transmissionOptions}
              error={errors.transmission?.message}
              {...register('transmission')}
            />

            <Select
              label="Body Type *"
              placeholder="Select body type"
              options={bodyTypeOptions}
              error={errors.bodyType?.message}
              {...register('bodyType')}
            />

            <Input
              label="Mileage *"
              type="number"
              placeholder="Enter mileage"
              error={errors.mileage?.message}
              {...register('mileage', { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price (USD) *"
              type="number"
              placeholder="Enter asking price"
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Pricing Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Research similar cars in your area</li>
                  <li>Consider your car's condition</li>
                  <li>Be competitive but fair</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                rows={6}
                placeholder="Describe your car's condition, features, maintenance history, and any other relevant details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Photos</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Add photos of your car</p>
            <p className="text-gray-600 mb-4">Upload up to 10 high-quality photos. Good photos help sell faster!</p>
            <Button type="button" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Choose Photos
            </Button>
            <p className="text-xs text-gray-500 mt-2">Photo upload coming soon</p>
          </div>
        </div>

        {/* Error Message */}
        {createCarMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">
              {getErrorMessage(createCarMutation.error)}
            </p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="flex-1"
            loading={createCarMutation.isPending}
            disabled={createCarMutation.isPending}
          >
            Create Listing
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/profile')}
            disabled={createCarMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}