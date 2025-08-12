import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Car, 
  Heart, 
  Settings, 
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCars } from '@/hooks/useCars';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'favorites' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Get user's cars (we'll need to modify the API to filter by seller)
  const { data: userCars } = useCars({ seller: user?._id });

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'cars' as const, label: 'My Cars', icon: Car },
    { id: 'favorites' as const, label: 'Favorites', icon: Heart },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Cars Listed</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    {userCars?.length || 0}
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Favorites</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-2">0</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Days Active</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 mt-2">
                    {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24))}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Welcome to CarSale!</p>
                      <p className="text-xs text-gray-500">Account created on {formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Cars Tab */}
          {activeTab === 'cars' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">My Car Listings</h3>
                <Button
                  onClick={() => navigate('/create-car')}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Car</span>
                </Button>
              </div>

              {userCars && userCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCars.map((car) => (
                    <div key={car._id} className="border rounded-lg p-4">
                      <div className="h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                        <Car className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-semibold">{car.year} {car.make} {car.model}</h4>
                      <p className="text-green-600 font-bold">${car.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mb-3">{car.mileage.toLocaleString()} miles</p>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars listed yet</h3>
                  <p className="text-gray-600 mb-4">Start selling by adding your first car listing.</p>
                  <Button onClick={() => navigate('/create-car')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Car
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="text-center py-8">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-4">Save cars you're interested in to see them here.</p>
              <Button onClick={() => navigate('/cars')}>Browse Cars</Button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={user.name}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Email Address"
                    value={user.email}
                    disabled={!isEditing}
                  />
                </div>
                
                {isEditing && (
                  <div className="flex space-x-4 mt-4">
                    <Button>Save Changes</Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications about your listings</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive SMS for important updates</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                <Button variant="outline" className="text-red-600 border-red-600">
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}