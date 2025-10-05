import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { PlanStop, TravelPlan } from '../App';
import './MapView.css';

type MapViewProps = {
  plan: TravelPlan | null;
};

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 49.2796, lng: -122.9199 }; // Burnaby, BC
const EMBEDDED_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
console.log('[MapView] Embedded key present:', Boolean(EMBEDDED_MAPS_KEY));

function MapView({ plan }: MapViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const cacheRef = useRef(new Map<string, google.maps.LatLngLiteral>());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapsKey, setMapsKey] = useState<string | null>(EMBEDDED_MAPS_KEY ?? null);
  const [isLoadingKey, setIsLoadingKey] = useState(!EMBEDDED_MAPS_KEY);

  useEffect(() => {
    if (EMBEDDED_MAPS_KEY) {
      setIsLoadingKey(false);
      return;
    }

    let cancelled = false;

    async function fetchMapsKey() {
      const baseUrl = window.location.origin;
      const endpoint = `${baseUrl}/api/config/maps-key`;
      console.log('[MapView] Fetching key from backend at', endpoint);
      console.log('[MapView] Requesting key from backend…');
      setIsLoadingKey(true);

      try {
        const response = await fetch(endpoint);
        console.log('[MapView] Backend response status:', response.status);
        if (!response.ok) {
          throw new Error('Key not configured');
        }
        const payload: { googleMapsApiKey?: string } = await response.json();
        console.log('[MapView] Backend payload received:', Object.keys(payload));
        if (cancelled) {
          return;
        }
        if (payload.googleMapsApiKey) {
          setMapsKey(payload.googleMapsApiKey);
          console.log('[MapView] Loaded key prefix:', payload.googleMapsApiKey.slice(0, 8));
          setMapError(null);
        } else {
          console.log('[MapView] Payload missing googleMapsApiKey property');
          setMapError('Google Maps API key is not configured.');
        }
      } catch (error) {
        console.error('[MapView] Failed to load key from backend', error);
        if (!cancelled) {
          setMapError('Live map is unavailable because the Google Maps API key is not configured.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingKey(false);
        }
      }
    }

    fetchMapsKey();

    return () => {
      cancelled = true;
    };
  }, []);

  const loader = useMemo(() => {
    if (!mapsKey) {
      console.log('[MapView] Maps loader waiting for key. Error?', mapError);
      return null;
    }
    console.log('[MapView] Creating Google Maps loader with key prefix:', mapsKey.slice(0, 8));
    return new Loader({ apiKey: mapsKey, version: 'weekly', libraries: ['places'] });
  }, [mapsKey]);

  useEffect(() => {
    if (!canvasRef.current || !loader) {
      return;
    }

    let cancelled = false;

    loader
      .load()
      .then((google) => {
        if (cancelled || !canvasRef.current) {
          return;
        }

        setMapError(null);
        mapRef.current = new google.maps.Map(canvasRef.current, {
          center: DEFAULT_CENTER,
          zoom: 12,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        });
        infoWindowRef.current = new google.maps.InfoWindow();
      })
      .catch((error) => setMapError(error instanceof Error ? error.message : 'Failed to load Maps SDK'));

    return () => {
      cancelled = true;
    };
  }, [loader]);

  useEffect(() => {
    if (!plan) {
      clearMarkers();
      return;
    }

    if (!loader || !mapRef.current) {
      return;
    }

    let active = true;

    loader.load().then((google) => {
      if (!active) {
        return;
      }

      const map = mapRef.current;
      if (!map) {
        return;
      }

      const geocoder = new google.maps.Geocoder();
      const stops = plan.stops.slice(0, 6);
      setMapError(null);

      Promise.all(stops.map((stop) => geocodeStop(stop, geocoder, cacheRef.current)))
        .then((results) => {
          if (!active) {
            return;
          }

          clearMarkers();
          const bounds = new google.maps.LatLngBounds();

          results.forEach((result, index) => {
            if (!result) {
              return;
            }

            bounds.extend(result.position);

            const marker = new google.maps.Marker({
              position: result.position,
              map,
              label: `${index + 1}`,
              title: result.label,
            });

            marker.addListener('click', () => {
              if (!infoWindowRef.current) {
                return;
              }
              const title = escapeHtml(result.label);
              const details = result.description ? `<p>${escapeHtml(result.description)}</p>` : '';
              infoWindowRef.current.setContent(
                `<div class="map__info-window"><strong>${title}</strong>${details}</div>`
              );
              infoWindowRef.current.open({ map, anchor: marker });
            });

            markersRef.current.push(marker);
          });

          if (!markersRef.current.length) {
            map.setCenter(DEFAULT_CENTER);
            map.setZoom(11);
          } else if (markersRef.current.length === 1) {
            map.setCenter(markersRef.current[0].getPosition() ?? DEFAULT_CENTER);
            map.setZoom(13);
          } else {
            map.fitBounds(bounds, 48);
          }
        })
        .catch(() => {
          if (active) {
            setMapError('Unable to plot stops on the map right now.');
          }
        });
    });

    return () => {
      active = false;
    };
  }, [plan, loader]);

  if (!mapsKey) {
    const message = mapError
      ? mapError
      : isLoadingKey
        ? 'Loading map configuration…'
        : 'Add `VITE_GOOGLE_MAPS_API_KEY` to your environment (or configure the backend) to enable the live map view.';
    return (
      <div className="map">
        <div className="map__message">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="map">
      <div ref={canvasRef} className="map__canvas" />
      {!plan ? (
        <div className="map__message">Select a plan to preview the route.</div>
      ) : null}
      {mapError ? <div className="map__message map__message--error">{mapError}</div> : null}
    </div>
  );

  function clearMarkers() {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    infoWindowRef.current?.close();
  }
}

type GeocodeResult = {
  label: string;
  description?: string;
  position: google.maps.LatLngLiteral;
};

async function geocodeStop(
  stop: Pick<PlanStop, 'label' | 'description' | 'placeId'>,
  geocoder: google.maps.Geocoder,
  cache: Map<string, google.maps.LatLngLiteral>
): Promise<GeocodeResult | null> {
  const { label, description, placeId } = stop;
  const cacheKey = placeId ?? label;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { label, description, position: cached };
  }

  return new Promise((resolve) => {
    const request: google.maps.GeocoderRequest = placeId
      ? { placeId }
      : { address: label };

    geocoder.geocode(request, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location.toJSON();
        cache.set(cacheKey, location);
        resolve({ label, description, position: location });
      } else {
        resolve(null);
      }
    });
  });
}

export default MapView;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case "'":
        return '&#39;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
}
