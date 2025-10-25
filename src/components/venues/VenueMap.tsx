"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useTheme } from 'next-themes';
import { MapPin, Loader2, ZoomIn, ZoomOut, Maximize2, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

// Ensure Google Maps types are available
declare global {
  interface Window {
    google: any;
  }
}

/**
 * VenueMap Component
 * 
 * A responsive Google Maps component for displaying venue locations
 * with dark mode support and modern UI styling.
 */
interface VenueLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price?: string;
  rating?: number;
}

interface VenueMapProps {
  // Single venue mode
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  // Multiple venues mode
  venues?: VenueLocation[];
  zoom?: number;
  className?: string;
  showPin?: boolean;
  showControls?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  onVenueClick?: (venue: VenueLocation) => void;
  height?: number | string;
}

const VenueMap: React.FC<VenueMapProps> = ({
  name,
  address,
  lat,
  lng,
  venues,
  zoom = 15,
  className = '',
  showPin = true,
  showControls = true,
  onMapClick,
  onVenueClick,
  height = 400,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  useEffect(() => {
    const initMap = async () => {
      setIsLoading(true);
      setError(null);

      let googleGlobal: any;
      let localMap: any = null;
      const listeners: any[] = [];
      const createdMarkers: any[] = [];
      const infoWindows: any[] = [];

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
        });

        await loader.load();

        if (!mapRef.current) {
          setError('Map container not found.');
          setIsLoading(false);
          return;
        }

        googleGlobal = window.google;

        if (!googleGlobal || !googleGlobal.maps) {
          setError('Google Maps SDK failed to initialize.');
          setIsLoading(false);
          return;
        }

        const googleMaps = googleGlobal.maps;

        const mapStyles = {
          light: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
            },
          ],
          dark: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ saturation: 36 }, { color: '#ffffff' }, { lightness: 40 }],
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'on' }, { color: '#000000' }, { lightness: 16 }],
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.fill',
              stylers: [{ color: '#000000' }, { lightness: 20 }],
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#000000' }, { lightness: 17 }, { weight: 1.2 }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }, { lightness: 20 }],
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }, { lightness: 21 }],
            },
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.fill',
              stylers: [{ color: '#000000' }, { lightness: 17 }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#000000' }, { lightness: 29 }, { weight: 0.2 }],
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }, { lightness: 18 }],
            },
            {
              featureType: 'road.local',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }, { lightness: 16 }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }, { lightness: 19 }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }, { lightness: 17 }],
            },
          ],
        };

        let resolvedCoords = { lat: 28.6139, lng: 77.2090 }; // New Delhi by default
        let mapZoom = zoom;

        // Handle multiple venues mode
        if (venues && venues.length > 0) {
          // Calculate bounds to fit all venues
          const bounds = new googleMaps.LatLngBounds();
          venues.forEach(venue => {
            bounds.extend({ lat: venue.lat, lng: venue.lng });
          });
          
          // Use center of bounds
          const center = bounds.getCenter();
          resolvedCoords = { lat: center.lat(), lng: center.lng() };
          mapZoom = 12; // Wider view for multiple venues
        } else if (lat && lng) {
          resolvedCoords = { lat, lng };
        } else if (address) {
          try {
            const { Geocoder } = await loader.importLibrary('geocoding');
            const geocoder = new Geocoder();

            const results = await geocoder.geocode({ address });
            if (results.results && results.results.length > 0) {
              const location = results.results[0].geometry.location;
              resolvedCoords = {
                lat: location.lat(),
                lng: location.lng(),
              };
            }
          } catch (error) {
            console.error('Error geocoding address:', error);
            setError('Could not find this location. Please check the address.');
          }
        }

        localMap = new googleMaps.Map(mapRef.current, {
          center: { lat: resolvedCoords.lat, lng: resolvedCoords.lng },
          zoom: mapZoom,
          disableDefaultUI: true,
          styles: theme === 'dark' ? mapStyles.dark : mapStyles.light,
          gestureHandling: 'cooperative',
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setMapInstance(localMap);
        setCurrentZoom(mapZoom);
        setMapCoordinates(resolvedCoords);

        if (onMapClick) {
          listeners.push(googleMaps.event.addListener(localMap, 'click', (e: any) => {
            if (e.latLng) {
              onMapClick(e.latLng.lat(), e.latLng.lng());
            }
          }));
        }

        listeners.push(googleMaps.event.addListener(localMap, 'zoom_changed', () => {
          setCurrentZoom((localMap as any).getZoom() || mapZoom);
        }));

        // Handle multiple venues
        if (venues && venues.length > 0) {
          venues.forEach((venue) => {
            const markerIcon = {
              path: 'M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.69 7.35 13.94 7.65 14.29a1.12 1.12 0 0 0 1.7 0c.3-.35 7.65-8.6 7.65-14.29C20.5 3.81 16.69 0 12 0zm0 11.75a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5z',
              fillColor: theme === 'dark' ? '#ff4d4d' : '#e11d48',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: theme === 'dark' ? '#ffffff' : '#000000',
              strokeOpacity: 0.2,
              scale: 1.2,
              anchor: new googleMaps.Point(12, 22),
            };

            const marker = new googleMaps.Marker({
              position: { lat: venue.lat, lng: venue.lng },
              map: localMap,
              title: venue.name,
              animation: googleMaps.Animation.DROP,
              icon: markerIcon,
            });

            createdMarkers.push(marker);

            const isDark = theme === 'dark';
            const infoWindow = new googleMaps.InfoWindow({
              content: `<div style="padding: 12px; font-family: system-ui, sans-serif; border-radius: 8px; ${isDark ? 'background-color: #1f1f1f; color: #e0e0e0;' : ''}">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: ${isDark ? '#ff4d4d' : '#e11d48'};">${venue.name}</h3>
                <p style="margin: 6px 0 0; font-size: 14px; color: ${isDark ? '#a0a0a0' : '#666'}; line-height: 1.4;">${venue.address}</p>
                ${venue.price ? `<p style="margin: 6px 0 0; font-size: 14px; font-weight: 600; color: ${isDark ? '#ff4d4d' : '#e11d48'};">${venue.price}</p>` : ''}
                ${venue.rating ? `<p style="margin: 6px 0 0; font-size: 14px; color: ${isDark ? '#ffd700' : '#f59e0b'};">★ ${venue.rating}</p>` : ''}
              </div>`,
              pixelOffset: new googleMaps.Point(0, -40),
              maxWidth: 320,
            });

            listeners.push(marker.addListener('click', () => {
              infoWindow.open(localMap, marker);
              if (onVenueClick) {
                onVenueClick(venue);
              }
            }));

            infoWindows.push(infoWindow);
          });
        } else if (showPin) {
          // Single venue mode
          const markerIcon = {
            path: 'M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.69 7.35 13.94 7.65 14.29a1.12 1.12 0 0 0 1.7 0c.3-.35 7.65-8.6 7.65-14.29C20.5 3.81 16.69 0 12 0zm0 11.75a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5z',
            fillColor: theme === 'dark' ? '#ff4d4d' : '#e11d48',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: theme === 'dark' ? '#ffffff' : '#000000',
            strokeOpacity: 0.2,
            scale: 1.5,
            anchor: new googleMaps.Point(12, 22),
          };

          const marker = new googleMaps.Marker({
            position: { lat: resolvedCoords.lat, lng: resolvedCoords.lng },
            map: localMap,
            title: name || address,
            animation: googleMaps.Animation.DROP,
            icon: markerIcon,
          });

          createdMarkers.push(marker);

          if (name) {
            const isDark = theme === 'dark';
            const infoWindow = new googleMaps.InfoWindow({
              content: `<div style="padding: 12px; font-family: system-ui, sans-serif; border-radius: 8px; ${isDark ? 'background-color: #1f1f1f; color: #e0e0e0;' : ''}">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: ${isDark ? '#ff4d4d' : '#e11d48'};">${name}</h3>
                ${address ? `<p style="margin: 6px 0 0; font-size: 14px; color: ${isDark ? '#a0a0a0' : '#666'}; line-height: 1.4;">${address}</p>` : ''}
              </div>`,
              pixelOffset: new googleMaps.Point(0, -40),
              maxWidth: 320,
            });

            listeners.push(googleMaps.event.addListener(localMap, 'tilesloaded', () => {
              infoWindow.open(localMap);
            }));

            infoWindows.push(infoWindow);
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Could not load the map. Please try again later.');
      } finally {
        setIsLoading(false);
      }

      return { googleGlobal, localMap, listeners, createdMarkers, infoWindows };
    };

    initMap().then((handles) => {
      const cleanupHandles = handles;

      return () => {
        if (!cleanupHandles) return;

        const { googleGlobal: gg, localMap: map, listeners, createdMarkers, infoWindows } = cleanupHandles;

        listeners.forEach((listener) => {
          if (listener && typeof listener.remove === 'function') {
            listener.remove();
          }
        });

        createdMarkers.forEach((marker) => {
          if (marker && typeof marker.setMap === 'function') {
            marker.setMap(null);
          }
        });

        infoWindows.forEach((infoWindow) => {
          if (infoWindow && typeof infoWindow.close === 'function') {
            infoWindow.close();
          }
        });

        if (gg?.maps?.event?.clearInstanceListeners && map) {
          gg.maps.event.clearInstanceListeners(map);
        }
      };
    });
  }, [address, lat, lng, name, venues, zoom, theme, showPin]);

  const handleZoomIn = () => {
    if (mapInstance) {
      (mapInstance as any).setZoom(((mapInstance as any).getZoom() || zoom) + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      (mapInstance as any).setZoom(((mapInstance as any).getZoom() || zoom) - 1);
    }
  };

  const handleRecenter = () => {
    if (mapInstance && mapCoordinates) {
      (mapInstance as any).setCenter({ lat: mapCoordinates.lat, lng: mapCoordinates.lng });
      (mapInstance as any).setZoom(zoom);
    }
  };

  const handleFullscreen = () => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      mapElement.requestFullscreen();
    }
  };

  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden shadow-sm transition-all duration-300",
      className
    )} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10" aria-live="polite" aria-busy="true">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Loading map…</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10 p-4" role="alert">
          <MapPin className="h-10 w-10 text-primary mb-2" />
          <p className="text-sm text-center text-muted-foreground">{error}</p>
        </div>
      )}

      {showControls && !isLoading && !error && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm"
            onClick={handleRecenter}
            aria-label="Recenter map"
          >
            <Navigation className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm"
            onClick={handleFullscreen}
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full transition-opacity duration-300" />
    </div>
  );
};

export default VenueMap;
