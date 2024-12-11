import { useState } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { MapPin, Search, Plus } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  keywords: string[];
  competitors: string[];
}

export const LocalSEO = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    keywords: '',
    competitors: ''
  });

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      alert('Please fill in required fields');
      return;
    }

    const location: Location = {
      id: Date.now().toString(),
      name: newLocation.name,
      address: newLocation.address,
      keywords: newLocation.keywords.split(',').map(k => k.trim()),
      competitors: newLocation.competitors.split(',').map(c => c.trim())
    };

    setLocations([...locations, location]);
    setNewLocation({ name: '', address: '', keywords: '', competitors: '' });
    setShowAddLocation(false);
  };

  return (
    <DashboardLayout 
      title="Local SEO"
      actions={
        <button 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center"
          onClick={() => setShowAddLocation(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </button>
      }
    >
      {showAddLocation ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Location</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                placeholder="e.g., Coffee Shop NYC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                value={newLocation.address}
                onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                placeholder="Full address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Keywords
              </label>
              <input
                type="text"
                value={newLocation.keywords}
                onChange={(e) => setNewLocation({ ...newLocation, keywords: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                placeholder="Comma-separated keywords"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Competitors
              </label>
              <input
                type="text"
                value={newLocation.competitors}
                onChange={(e) => setNewLocation({ ...newLocation, competitors: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                placeholder="Comma-separated competitor names"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                onClick={() => setShowAddLocation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                onClick={handleAddLocation}
              >
                Add Location
              </button>
            </div>
          </div>
        </div>
      ) : locations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(location => (
            <div key={location.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {location.address}
                  </p>
                </div>
                <button className="text-violet-600 hover:text-violet-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              {location.keywords.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {location.keywords.map((keyword, i) => (
                      <span key={i} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {location.competitors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Competitors</h4>
                  <ul className="text-sm space-y-1">
                    {location.competitors.map((competitor, i) => (
                      <li key={i} className="text-gray-600">{competitor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-medium mb-2">No Locations Added</h2>
          <p className="text-gray-600 mb-4">Add your first location to start tracking local SEO performance</p>
          <button 
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 inline-flex items-center"
            onClick={() => setShowAddLocation(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}; 