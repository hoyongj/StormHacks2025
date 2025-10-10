import { useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { TravelPlan } from "../App";
import "./MapView.css";

type MultiLegMapViewProps = {
    plan: TravelPlan | null;
};

type LegPolyline = {
    from_index: number;
    to_index: number;
    polyline: string;
    warnings?: string[];
    // Keeping segments loosely typed here to avoid pulling full type from App
    // You can refine this later if you want to render segment details per leg
    segments?: unknown[];
};

type MultiLegRoute = {
    plan_id: string;
    legs: LegPolyline[];
};

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
    lat: 49.2796,
    lng: -122.9199,
};
const MAPS_MAP_ID: string =
    import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";
const EMBEDDED_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function MultiLegMapView({ plan }: MultiLegMapViewProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const polylinesRef = useRef<google.maps.Polyline[]>([]);
    const [legs, setLegs] = useState<LegPolyline[]>([]);
    const [mapsKey, setMapsKey] = useState<string | null>(
        EMBEDDED_MAPS_KEY ?? null
    );
    const [mapError, setMapError] = useState<string | null>(null);
    const [isLoadingKey, setIsLoadingKey] = useState(!EMBEDDED_MAPS_KEY);
    const [mapReady, setMapReady] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshNonce, setRefreshNonce] = useState(0);

    const loader = useMemo(() => {
        if (!mapsKey) return null;
        // Keep libraries ordering identical to MapView to prevent Loader option mismatch
        return new Loader({
            apiKey: mapsKey,
            version: "weekly",
            libraries: ["places", "marker"],
        });
    }, [mapsKey]);

    useEffect(() => {
        if (EMBEDDED_MAPS_KEY) {
            setIsLoadingKey(false);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                setIsLoadingKey(true);
                const res = await fetch(`${API_BASE_URL}/config/maps-key`);
                if (!res.ok) throw new Error("Key not configured");
                const data: { googleMapsApiKey?: string } = await res.json();
                if (cancelled) return;
                if (data.googleMapsApiKey) setMapsKey(data.googleMapsApiKey);
            } catch (e) {
                if (!cancelled)
                    setMapError(
                        "Live map unavailable without Google Maps key."
                    );
            } finally {
                if (!cancelled) setIsLoadingKey(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !loader) return;
        let cancelled = false;
        setMapReady(false);
        loader
            .load()
            .then(() => {
                if (cancelled || !canvasRef.current) return;
                const options: google.maps.MapOptions = {
                    center: DEFAULT_CENTER,
                    zoom: 12,
                    streetViewControl: false,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    mapId: MAPS_MAP_ID,
                };
                mapRef.current = new google.maps.Map(
                    canvasRef.current,
                    options
                );
                setMapReady(true);
            })
            .catch(() => {
                if (!cancelled) setMapError("Failed to load Maps SDK");
            });
        return () => {
            cancelled = true;
            mapRef.current = null;
            setMapReady(false);
        };
    }, [loader]);

    useEffect(() => {
        clearPolylines();
        setLegs([]);
        if (!plan) {
            setIsRefreshing(false);
            return;
        }
        if (!loader || !mapReady || !mapRef.current) {
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                setIsRefreshing(true);
                setMapError(null);
                const response = await fetch(
                    `${API_BASE_URL}/plan/${plan.id}/route-multileg`
                );
                if (!response.ok) {
                    if (!cancelled) {
                        setMapError("Unable to load multi-leg route.");
                    }
                    return;
                }
                const payload: MultiLegRoute = await response.json();
                if (cancelled || !mapRef.current) {
                    return;
                }
                const google = await loader.load();

                setLegs(payload.legs ?? []);
                const allLatLngs: google.maps.LatLngLiteral[] = [];
                payload.legs.forEach((leg, idx) => {
                    const path = decodePolyline(leg.polyline);
                    if (!path.length) {
                        return;
                    }
                    allLatLngs.push(...path);
                    const polyline = new google.maps.Polyline({
                        path,
                        strokeColor: colors[idx % colors.length],
                        strokeOpacity: 0.9,
                        strokeWeight: 4,
                    });
                    polyline.setMap(mapRef.current!);
                    polylinesRef.current.push(polyline);
                });

                if (allLatLngs.length) {
                    const bounds = new google.maps.LatLngBounds();
                    allLatLngs.forEach((point) => bounds.extend(point));
                    mapRef.current.fitBounds(bounds, 48);
                }
            } catch (error) {
                if (!cancelled) {
                    setMapError("Unable to draw multi-leg route.");
                }
            } finally {
                if (!cancelled) {
                    setIsRefreshing(false);
                }
            }
        })();

        return () => {
            cancelled = true;
            setIsRefreshing(false);
        };
    }, [plan?.id, loader, mapReady, refreshNonce]);

    if (!mapsKey) {
        const message = mapError
            ? mapError
            : isLoadingKey
            ? "Loading map configuration…"
            : "Add VITE_GOOGLE_MAPS_API_KEY to enable map.";
        return (
            <div className="map">
                <div className="map__message">{message}</div>
            </div>
        );
    }

    return (
        <div className="map">
            <div ref={canvasRef} className="map__canvas" />
            <button
                type="button"
                onClick={() => setRefreshNonce((value) => value + 1)}
                disabled={isRefreshing}
                style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    padding: "8px 12px",
                    background: "#1a3cff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: isRefreshing ? "default" : "pointer",
                    fontSize: 13,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    opacity: isRefreshing ? 0.7 : 1,
                    transition: "opacity 0.2s ease",
                }}
            >
                {isRefreshing ? "Refreshing…" : "Refresh Map"}
            </button>
            {!plan ? (
                <div className="map__message">
                    Select a plan to preview the multi-leg route.
                </div>
            ) : null}
            {mapError ? (
                <div className="map__message map__message--error">
                    {mapError}
                </div>
            ) : null}
            {plan && legs.length > 0 ? (
                <div
                    style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        padding: "8px 10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        fontSize: 12,
                        color: "#111827",
                    }}
                >
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Legs</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {legs.map((leg, i) => (
                            <div
                                key={`${leg.from_index}-${leg.to_index}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 12,
                                        height: 12,
                                        borderRadius: 2,
                                        background: colors[i % colors.length],
                                        border: "1px solid rgba(0,0,0,0.1)",
                                    }}
                                />
                                <span>
                                    {leg.from_index + 1} → {leg.to_index + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );

    function clearPolylines() {
        polylinesRef.current.forEach((p) => p.setMap(null));
        polylinesRef.current = [];
    }
}

const colors = ["#1a3cff", "#7F5AF0", "#2CB1BC", "#EF4444", "#10B981"];

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
