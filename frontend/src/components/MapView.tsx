import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { PlanStop, TravelPlan } from '../App';
import './MapView.css';

type MapMode = 'single' | 'multileg';

type MapViewProps = {
  plan: TravelPlan | null;
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
  refreshKey: number;
  onRequestRefresh: () => void;
};

type MultiLegLeg = {
  from_index: number;
  to_index: number;
  polyline: string;
};

type MultiLegRoute = {
  plan_id: string;
  legs: MultiLegLeg[];
};

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 49.2796, lng: -122.9199 }; // Burnaby, BC
const EMBEDDED_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAPS_MAP_ID: string = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const LEG_COLORS = ['#1a3cff', '#7F5AF0', '#2CB1BC', '#EF4444', '#10B981'];

function MapView({ plan, mode, onModeChange, refreshKey, onRequestRefresh }: MapViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const cacheRef = useRef(new Map<string, google.maps.LatLngLiteral>());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const routeRef = useRef<google.maps.Polyline | null>(null);
  const multiLegPolylinesRef = useRef<google.maps.Polyline[]>([]);
  const planIdRef = useRef<string | null>(null);
  const [legendLegs, setLegendLegs] = useState<MultiLegLeg[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapsKey, setMapsKey] = useState<string | null>(EMBEDDED_MAPS_KEY ?? null);
  const [isLoadingKey, setIsLoadingKey] = useState(!EMBEDDED_MAPS_KEY);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    return new Loader({ apiKey: mapsKey, version: 'weekly', libraries: ['places', 'marker'] });
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
        const options: google.maps.MapOptions = {
          center: DEFAULT_CENTER,
          zoom: 12,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        };
        options.mapId = MAPS_MAP_ID;
        mapRef.current = new google.maps.Map(canvasRef.current, options);
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
      clearMultiLegRoutes();
      setLegendLegs([]);
      setIsRefreshing(false);
      return;
    }

    if (!loader) {
      return;
    }

    let active = true;
    setIsRefreshing(true);

    loader
      .load()
      .then((google) => {
        if (!active || !plan) {
          return;
        }

        const map = mapRef.current;
        if (!map) {
          setIsRefreshing(false);
          return;
        }

        const geocoder = new google.maps.Geocoder();
        const stops = plan.stops.slice(0, 6);
        setMapError(null);

        Promise.all(stops.map((stop) => geocodeStop(stop, geocoder, cacheRef.current)))
          .then((results) => {
            if (!active || !plan) {
              return;
            }

            clearMarkers();
            const bounds = new google.maps.LatLngBounds();

            results.forEach((result, index) => {
              if (!result) {
                return;
              }

              bounds.extend(result.position);

              const marker = createMarker(map, result.position, result.label, index + 1);

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
              const singlePosition = getMarkerPosition(markersRef.current[0]) ?? DEFAULT_CENTER;
              map.setCenter(singlePosition);
              map.setZoom(13);
            } else {
              map.fitBounds(bounds, 48);
            }

            const canUseMultiLeg = plan.stops.length >= 2;
            const drawPromise =
              mode === 'multileg' && canUseMultiLeg
                ? loadMultiLegRoute(plan.id, google)
                : loadRoute(plan.id, google);

            return drawPromise;
          })
          .catch(() => {
            if (active) {
              setMapError('Unable to plot stops on the map right now.');
              clearRoute();
              clearMultiLegRoutes();
              setLegendLegs([]);
            }
          })
          .finally(() => {
            if (active) {
              setIsRefreshing(false);
            }
          });
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setMapError(error instanceof Error ? error.message : 'Failed to load Maps SDK');
        setIsRefreshing(false);
      });

    return () => {
      active = false;
    };
  }, [plan, loader, mode, refreshKey]);

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

  const canUseMultiLeg = (plan?.stops?.length ?? 0) >= 2;
  const refreshDisabled = !plan || isRefreshing;

  return (
    <div className="map">
      <div ref={canvasRef} className="map__canvas" />

      <div className="map__controls">
        <div className="map__mode-toggle" role="group" aria-label="Route view mode">
          <button
            type="button"
            className={mode === 'single' ? 'map__mode-button map__mode-button--active' : 'map__mode-button'}
            onClick={() => onModeChange('single')}
            aria-pressed={mode === 'single'}
          >
            Standard Route
          </button>
          <button
            type="button"
            className={mode === 'multileg' ? 'map__mode-button map__mode-button--active' : 'map__mode-button'}
            onClick={() => {
              if (canUseMultiLeg) {
                onModeChange('multileg');
              }
            }}
            aria-pressed={mode === 'multileg'}
            disabled={!canUseMultiLeg}
          >
            Multi-leg Transit
          </button>
        </div>
        <button
          type="button"
          className="map__refresh"
          onClick={() => {
            if (!refreshDisabled) {
              onRequestRefresh();
            }
          }}
          disabled={refreshDisabled}
        >
          {isRefreshing ? 'Refreshing…' : 'Refresh Map'}
        </button>
      </div>

      {!plan ? (
        <div className="map__message">Select a plan to preview the route.</div>
      ) : null}
      {mapError ? <div className="map__message map__message--error">{mapError}</div> : null}

      {plan && mode === 'multileg' && legendLegs.length ? (
        <div className="map__legend">
          <div className="map__legend-title">Legs</div>
          <ul className="map__legend-list">
            {legendLegs.map((leg, index) => (
              <li key={`${leg.from_index}-${leg.to_index}`} className="map__legend-item">
                <span
                  className="map__legend-swatch"
                  style={{ backgroundColor: LEG_COLORS[index % LEG_COLORS.length] }}
                />
                <span className="map__legend-text">
                  {leg.from_index + 1} → {leg.to_index + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  function clearMarkers() {
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];
    infoWindowRef.current?.close();
  }

  function clearRoute() {
    routeRef.current?.setMap(null);
    routeRef.current = null;
    setLegendLegs([]);
  }

  function clearMultiLegRoutes() {
    multiLegPolylinesRef.current.forEach((polyline) => {
      polyline.setMap(null);
    });
    multiLegPolylinesRef.current = [];
  }

  async function loadRoute(planId: string, google: typeof window.google) {
    clearRoute();
    clearMultiLegRoutes();
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

  async function loadMultiLegRoute(planId: string, google: typeof window.google) {
    clearRoute();
    clearMultiLegRoutes();
    try {
      const response = await fetch(`/api/plan/${planId}/route-multileg`);
      if (!response.ok) {
        throw new Error('Failed to load multi-leg route');
      }

      const payload: MultiLegRoute = await response.json();
      if (planIdRef.current !== planId || !mapRef.current) {
        return;
      }

      const map = mapRef.current;
      const bounds = new google.maps.LatLngBounds();
      const polylines: google.maps.Polyline[] = [];

      (payload.legs ?? []).forEach((leg, index) => {
        const path = decodePolyline(leg.polyline);
        if (!path.length) {
          return;
        }
        path.forEach((point) => bounds.extend(point));
        const polyline = new google.maps.Polyline({
          path,
          strokeColor: LEG_COLORS[index % LEG_COLORS.length],
          strokeOpacity: 0.9,
          strokeWeight: 4,
        });
        polyline.setMap(map);
        polylines.push(polyline);
      });

      multiLegPolylinesRef.current = polylines;
      setLegendLegs(payload.legs ?? []);

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 48);
      }
    } catch (error) {
      setMapError('Unable to draw multi-leg route right now.');
      setLegendLegs([]);
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

function createMarkerContent(index: number): HTMLElement {
  const element = document.createElement('div');
  element.className = 'map__marker';
  element.textContent = `${index}`;
  return element;
}

function createMarker(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  title: string,
  index: number
): google.maps.marker.AdvancedMarkerElement {
  return new google.maps.marker.AdvancedMarkerElement({
    position,
    map,
    title,
    content: createMarkerContent(index),
    gmpClickable: true,
  });
}

function getMarkerPosition(
  marker: google.maps.marker.AdvancedMarkerElement
): google.maps.LatLngLiteral | google.maps.LatLng | null {
  const position = marker.position;
  if (!position) {
    return null;
  }
  return position instanceof google.maps.LatLng ? position : (position as google.maps.LatLngLiteral);
}
