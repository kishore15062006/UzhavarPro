import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useAuth from '../hooks/useAuth.js';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom green marker for farm
const greenMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom blue marker for delivery
const blueMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom orange marker for delivery agent
const orangeMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DeliveryRouteMap = ({ delivery }) => {
  const { user } = useAuth();
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agentLocation, setAgentLocation] = useState(
    user?.latitude && user?.longitude
      ? { lat: user.latitude, lng: user.longitude }
      : null
  );

  // Check if we have required data
  const hasCompleteData = 
    delivery?.farmLat && 
    delivery?.farmLng && 
    delivery?.deliveryLat && 
    delivery?.deliveryLng;

  // Try to get agent's current location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAgentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn('Could not retrieve delivery agent location:', err);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Fetch route from OSRM API
  useEffect(() => {
    if (!hasCompleteData) return;

    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError('');
        
        let url;
        if (agentLocation) {
          // 3-point route: Agent -> Farm -> Delivery
          url = `https://router.project-osrm.org/route/v1/driving/${agentLocation.lng},${agentLocation.lat};${delivery.farmLng},${delivery.farmLat};${delivery.deliveryLng},${delivery.deliveryLat}?overview=full&geometries=geojson`;
        } else {
          // 2-point route: Farm -> Delivery
          url = `https://router.project-osrm.org/route/v1/driving/${delivery.farmLng},${delivery.farmLat};${delivery.deliveryLng},${delivery.deliveryLat}?overview=full&geometries=geojson`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch route');
        }
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteCoordinates(coordinates);
        }
      } catch (err) {
        console.error('Route fetch error:', err);
        setError('Failed to load route');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [delivery, hasCompleteData, agentLocation]);

  // Calculate center point for map
  const center = hasCompleteData 
    ? (agentLocation
        ? [(agentLocation.lat + delivery.farmLat + delivery.deliveryLat) / 3, (agentLocation.lng + delivery.farmLng + delivery.deliveryLng) / 3]
        : [(delivery.farmLat + delivery.deliveryLat) / 2, (delivery.farmLng + delivery.deliveryLng) / 2])
    : [11.1271, 78.6569]; // Default Tamil Nadu center

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Route</h3>
        {!hasCompleteData && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
            <p className="font-medium">Location data not available</p>
            <p className="text-xs mt-1">Farm or delivery location coordinates are missing.</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
          Loading route...
        </div>
      )}

      {hasCompleteData ? (
        <MapContainer
          key={`${center[0]}-${center[1]}`}
          center={center}
          zoom={12}
          style={{ height: '360px', width: '100%' }}
          className="rounded border border-gray-200"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline
              positions={routeCoordinates}
              color="green"
              weight={4}
              opacity={0.7}
              dashArray="5, 10"
            />
          )}

          {/* Agent marker (orange) */}
          {agentLocation && (
            <Marker 
              position={[agentLocation.lat, agentLocation.lng]}
              icon={orangeMarkerIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-orange-700">Your Location (Agent)</p>
                  <p className="text-xs text-gray-500">({agentLocation.lat.toFixed(4)}, {agentLocation.lng.toFixed(4)})</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Farm marker (green) */}
          <Marker 
            position={[delivery.farmLat, delivery.farmLng]}
            icon={greenMarkerIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-green-700">Farm Location</p>
                <p className="text-gray-700">{delivery.farmAddress || 'Farm'}</p>
                <p className="text-xs text-gray-500">({delivery.farmLat.toFixed(4)}, {delivery.farmLng.toFixed(4)})</p>
              </div>
            </Popup>
          </Marker>

          {/* Delivery marker (blue) */}
          <Marker 
            position={[delivery.deliveryLat, delivery.deliveryLng]}
            icon={blueMarkerIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-blue-700">Delivery Location</p>
                <p className="text-gray-700">{delivery.deliveryAddress || 'Delivery'}</p>
                <p className="text-xs text-gray-500">({delivery.deliveryLat.toFixed(4)}, {delivery.deliveryLng.toFixed(4)})</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div style={{ height: '360px', width: '100%' }} className="rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600 text-center">
            Map will display once location data is available
          </p>
        </div>
      )}

      {hasCompleteData && (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-xs text-gray-600">Farm Location</p>
            <p className="font-medium text-gray-800">{delivery.farmAddress || 'Not specified'}</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-gray-600">Delivery Location</p>
            <p className="font-medium text-gray-800">{delivery.deliveryAddress || 'Not specified'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryRouteMap;
