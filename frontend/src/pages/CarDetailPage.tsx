import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  DollarSign, 
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Share2
} from 'lucide-react';
import { useCar } from '@/hooks/useCars';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { data: car, isLoading, error } = useCar(id!);

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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link 
          to="/cars" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cars
        </Link>
        <div className="text-center py-20">
          <p className="text-red-600">Car not found or failed to load.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        to="/cars" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cars
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Images */}
        <div className="space-y-4">
          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">Photos Coming Soon</p>
            </div>
          </div>
          
          {/* Thumbnail images would go here */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i}
                className="aspect-video bg-gray-200 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{car.brand.name} • {car.category.name}</p>
            
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(car.price)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold">{car.year}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Gauge className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Mileage</p>
                <p className="font-semibold">{formatMileage(car.mileage)} mi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Fuel className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Fuel Type</p>
                <p className="font-semibold">{car.fuelType}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Transmission</p>
                <p className="font-semibold">{car.transmission}</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Body Type:</span>
                  <span className="ml-2 font-medium">{car.bodyType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Color:</span>
                  <span className="ml-2 font-medium">{car.color}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{car.seller.name}</p>
                  <p className="text-sm text-gray-600">Member since {new Date(car.seller.createdAt).getFullYear()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <Button className="w-full flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Contact Seller</span>
                    </Button>
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Send Message</span>
                    </Button>
                  </>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <p className="text-gray-600 mb-2">Sign in to contact the seller</p>
                    <Link to="/login">
                      <Button size="sm">Sign In</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Cars Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Similar Cars</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Similar cars recommendations coming soon!</p>
        </div>
      </div>
    </div>
  );
}