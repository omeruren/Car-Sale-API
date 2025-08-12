import { Link } from 'react-router-dom';
import { Car, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav>
      <div className="container">
        <div className="flex justify-between items-center" style={{height: '4rem'}}>
          {/* Logo */}
          <Link to="/" className="logo">
            <Car />
            <span>CarSale</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/cars" className="nav-link">
              Browse Cars
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create-car" className="nav-link">
                  Sell Car
                </Link>
                <Link to="/profile" className="nav-link flex items-center space-x-2">
                  <User style={{width: '1rem', height: '1rem'}} />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <button onClick={handleLogout} className="nav-link flex items-center space-x-2">
                  <LogOut style={{width: '1rem', height: '1rem'}} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}