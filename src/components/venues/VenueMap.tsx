import React, { useRef, useEffect, useState } from 'react';

interface VenueMapProps {
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const VenueMap: React.FC<VenueMapProps> = ({ name, address, lat, lng, coordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<{lat: number, lng: number} | null>(
    coordinates ? coordinates : (lat && lng ? {lat, lng} : null)
  );

  useEffect(() => {
    // If coordinates were directly provided, update mapCoordinates
    if (coordinates) {
      setMapCoordinates(coordinates);
    }
    // If lat and lng were directly provided, update coordinates
    else if (lat && lng) {
      setMapCoordinates({lat, lng});
    }
    // Otherwise, if we have an address but no coordinates, geocode the address
    else if (address && !mapCoordinates) {
      geocodeAddress();
    }
  }, [address, lat, lng, coordinates]);

  useEffect(() => {
    // Load the Google Maps script if it hasn't been loaded yet
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current && mapCoordinates) {
      initMap();
    }
  }, [mapLoaded, mapCoordinates]);

  const geocodeAddress = () => {
    if (!address) return;
    
    // Create a script to load Google Maps API if it's not already loaded
    if (!window.google) {
      console.log('Google Maps API not loaded yet, address geocoding postponed');
      return;
    }
    
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        setMapCoordinates({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        console.error('Geocode was not successful:', status);
        // Fallback to a default location if geocoding fails
        setMapCoordinates({ lat: 40.7128, lng: -74.0060 }); // New York City
      }
    });
  };

  const initMap = () => {
    if (!mapRef.current || !mapCoordinates) return;
    
    const mapOptions = {
      center: mapCoordinates,
      zoom: 15,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true
    };
    
    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    
    // Add a marker for the venue
    new window.google.maps.Marker({
      position: mapCoordinates,
      map,
      title: name || 'Venue Location'
    });
  };

  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default VenueMap;
