import { Link } from 'react-router-dom';
import { Car, Search, Shield, Star } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Perfect Car
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Browse thousands of quality used cars from trusted sellers. 
              Find the car that matches your style and budget.
            </p>
            <div className="space-x-4">
              <Link 
                to="/cars" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold inline-block"
              >
                Browse Cars
              </Link>
              <Link 
                to="/create-car" 
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold inline-block"
              >
                Sell Your Car
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CarSale?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find cars by brand, price, year, and more with our advanced filtering system.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Sellers</h3>
              <p className="text-gray-600">
                All sellers are verified to ensure you're dealing with legitimate car owners.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Cars</h3>
              <p className="text-gray-600">
                Every car listing includes detailed information and high-quality photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who found their perfect car with us.
          </p>
          <Link 
            to="/register" 
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold inline-block"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}