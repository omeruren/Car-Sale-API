import { Link } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Settings, DollarSign } from 'lucide-react';
import type { Car } from '@/types';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Car Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">Photo Coming Soon</p>
        </div>
      </div>

      <div className="p-4">
        {/* Car Title */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-600">{car.brand.name}</p>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(car.price)}
            </span>
          </div>
        </div>

        {/* Car Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gauge className="h-4 w-4" />
            <span>{formatMileage(car.mileage)} mi</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-4 w-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Settings className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {car.description}
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to={`/cars/${car._id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>

      {/* Status Badge */}
      {car.isAvailable && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Available
        </div>
      )}
    </div>
  );
}