import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from '../config/axios';
import useAuth from '../hooks/useAuth.js';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapLocationPicker = ({ initialLat = 11.1271, initialLng = 78.6569, initialAddress = '', onSave, title = "Select Location", saveButtonText = "Save Location" }) => {
  const { updateLocation } = useAuth();
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const mapRef = useRef(null);

  // Synchronize initial coordinates when they are resolved/updated by parent
  useEffect(() => {
    if (initialLat) setLat(initialLat);
    if (initialLng) setLng(initialLng);
    if (initialAddress) setAddress(initialAddress);
  }, [initialLat, initialLng, initialAddress]);

  // Reverse geocode coordinates to get address
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      
      if (response.data && response.data.address) {
        const addr = response.data.address;
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
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          reverseGeocode(newLat, newLng);
          
          // Pan map to current location
          if (mapRef.current) {
            mapRef.current.setView([newLat, newLng], 13);
          }
        },
        (error) => {
          setError(`Error getting location: ${error.message}`);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  // Handle map click
  const handleMapClick = useCallback(async (e) => {
    const newLat = e.latlng.lat;
    const newLng = e.latlng.lng;
    setLat(newLat);
    setLng(newLng);
    await reverseGeocode(newLat, newLng);
  }, [reverseGeocode]);

  // Save location
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const res = await updateLocation(lat, lng, address);
      
      if (res.success) {
        setSuccess('Location saved successfully!');
        if (onSave) {
          onSave(res.data);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save location: ' + (res.error?.message || 'Error occurred'));
      }
    } catch (err) {
      setError('Failed to save location: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Map click effect
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    const handleClick = (e) => handleMapClick(e);
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [handleMapClick]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">Click on the map to select location or use your current location</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={getCurrentLocation}
          disabled={loading || saving}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 text-sm font-medium"
        >
          {loading ? 'Getting location...' : 'Use My Current Location'}
        </button>
      </div>

      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={13}
        style={{ height: '360px', width: '100%' }}
        ref={mapRef}
        className="rounded border border-gray-200"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{address || 'Loading address...'}</Popup>
        </Marker>
      </MapContainer>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-800 min-h-[60px] flex items-center">
          {loading ? 'Resolving address...' : (address || 'Click on map or use current location')}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || loading || !address}
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 font-medium"
      >
        {saving ? 'Saving...' : saveButtonText}
      </button>
    </div>
  );
};

export default MapLocationPicker;
