import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Separate component to handle map events
function MapEventHandler({ onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, onMapClick]);
  
  return null;
}

const DeliveryLocationMapPicker = ({ onLocationSelect, initialLat, initialLng, initialAddress }) => {
  const [lat, setLat] = useState(initialLat || 11.1271);
  const [lng, setLng] = useState(initialLng || 78.6569);
  const [address, setAddress] = useState(initialAddress || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialLat) setLat(initialLat);
    if (initialLng) setLng(initialLng);
    if (initialAddress) setAddress(initialAddress);
  }, [initialLat, initialLng, initialAddress]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          const formattedAddress = [
            addr.house_number && addr.road ? `${addr.house_number} ${addr.road}` : addr.road,
            addr.suburb || addr.city,
            addr.state,
            addr.postcode
          ].filter(Boolean).join(', ');
          
          setAddress(formattedAddress);
        } else {
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    await reverseGeocode(newLat, newLng);
  };

  const handleConfirm = () => {
    if (onLocationSelect) {
      onLocationSelect(lat, lng, address);
    }
  };

  return (
    <div className="space-y-3">
      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={13}
        style={{ height: '280px', width: '100%' }}
        className="rounded border border-gray-200"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
        <MapEventHandler onMapClick={handleMapClick} />
      </MapContainer>

      {loading && <p className="text-sm text-blue-600">Resolving address...</p>}
      
      {address && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-gray-600 mb-1">Selected Address:</p>
          <p className="text-sm font-medium text-gray-800">{address}</p>
        </div>
      )}

      {address && (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
        >
          Confirm Delivery Location
        </button>
      )}

      {!address && (
        <p className="text-xs text-gray-500 text-center py-2">Click on the map to select delivery location</p>
      )}
    </div>
  );
};

export default DeliveryLocationMapPicker;
