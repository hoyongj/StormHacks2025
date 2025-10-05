import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { PlanStop, TravelPlan } from '../App';
import './MapView.css';

type MapViewProps = {
  plan: TravelPlan | null;
};

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 49.2796, lng: -122.9199 }; // Burnaby, BC
const EMBEDDED_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function MapView({ plan }: MapViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const cacheRef = useRef(new Map<string, google.maps.LatLngLiteral>());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const routeRef = useRef<google.maps.Polyline | null>(null);
  const planIdRef = useRef<string | null>(null);
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
      setIsLoadingKey(true);

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Key not configured');
        }
        const payload: { googleMapsApiKey?: string } = await response.json();
        if (cancelled) {
          return;
        }
        if (payload.googleMapsApiKey) {
          setMapsKey(payload.googleMapsApiKey);
          setMapError(null);
        } else {
          setMapError('Google Maps API key is not configured.');
        }
      } catch (error) {
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
      return null;
    }
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
    planIdRef.current = plan?.id ?? null;

    if (!plan) {
      clearMarkers();
      clearRoute();
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

          loadRoute(plan.id, google);
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

  function clearRoute() {
    routeRef.current?.setMap(null);
    routeRef.current = null;
  }

  async function loadRoute(planId: string, google: typeof window.google) {
    clearRoute();
    try {
      const response = await fetch(`/api/plan/${planId}/route`);
      if (!response.ok) {
        return;
      }
      const payload: { polyline: string } = await response.json();
      if (!payload.polyline) {
        return;
      }
      if (planIdRef.current !== planId) {
        return;
      }
      const path = decodePolyline(payload.polyline);
      if (!path.length || !mapRef.current) {
        return;
      }
      routeRef.current = new google.maps.Polyline({
        path,
        strokeColor: '#1a3cff',
        strokeOpacity: 0.85,
        strokeWeight: 4,
      });
      routeRef.current.setMap(mapRef.current);
    } catch (error) {
      setMapError('Unable to draw the route right now.');
    }
  }
}

type GeocodeResult = {
  label: string;
  description?: string;
  position: google.maps.LatLngLiteral;
};

async function geocodeStop(
  stop: Pick<PlanStop, 'label' | 'description' | 'placeId' | 'latitude' | 'longitude'>,
  geocoder: google.maps.Geocoder,
  cache: Map<string, google.maps.LatLngLiteral>
): Promise<GeocodeResult | null> {
  const { label, description, placeId, latitude, longitude } = stop;
  const cacheKey = placeId ?? label;

  if (typeof latitude === 'number' && typeof longitude === 'number') {
    const position = { lat: latitude, lng: longitude };
    cache.set(cacheKey, position);
    return { label, description, position };
  }

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

function decodePolyline(encoded: string): google.maps.LatLngLiteral[] {
  let index = 0;
  const length = encoded.length;
  const path: google.maps.LatLngLiteral[] = [];
  let lat = 0;
  let lng = 0;

  while (index < length) {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    path.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return path;
}

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
