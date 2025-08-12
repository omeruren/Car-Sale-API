import { Link } from 'react-router-dom';
import { Car, Search, Shield, Star } from 'lucide-react';

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Your Perfect Car</h1>
          <p>
            Browse thousands of quality used cars from trusted sellers. 
            Find the car that matches your style and budget.
          </p>
          <div className="space-x-4">
            <Link to="/cars" className="btn btn-primary">
              Browse Cars
            </Link>
            <Link to="/create-car" className="btn btn-outline">
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <h2 style={{textAlign: 'center'}}>Why Choose CarSale?</h2>
          <div className="grid grid-cols-3">
            <div className="feature-card">
              <div className="feature-icon">
                <Search />
              </div>
              <h3>Easy Search</h3>
              <p className="text-gray-600">
                Find cars by brand, price, year, and more with our advanced filtering system.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Trusted Sellers</h3>
              <p className="text-gray-600">
                All sellers are verified to ensure you're dealing with legitimate car owners.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star />
              </div>
              <h3>Quality Cars</h3>
              <p className="text-gray-600">
                Every car listing includes detailed information and high-quality photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gray-50">
        <div className="container" style={{textAlign: 'center'}}>
          <h2>Ready to Get Started?</h2>
          <p className="text-gray-600" style={{fontSize: '1.25rem', marginBottom: '2rem'}}>
            Join thousands of satisfied customers who found their perfect car with us.
          </p>
          <Link to="/register" className="btn btn-primary">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}