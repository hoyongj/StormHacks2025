import { useEffect, useMemo } from "react";
import { TravelPlan, RouteSegment, PlanStop } from "../App";
import "./TripDetailPage.css";

type TripDetailPageProps = {
    plan: TravelPlan;
    routeSegments: RouteSegment[];
    onClose: () => void;
};

function TripDetailPage({ plan, routeSegments, onClose }: TripDetailPageProps) {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        // Add a class to the body to prevent background scrolling
        document.body.classList.add("modal-open");

        return () => {
            document.body.classList.remove("modal-open");
        };
    }, []);

    // Calculate total trip time
    const totalTripTime = useMemo(() => {
        let totalMinutes = 0;

        // Add time to spend at each stop
        plan.stops.forEach((stop) => {
            totalMinutes += (stop.timeToSpendDays || 0) * 24 * 60;
            totalMinutes += (stop.timeToSpendHours || 0) * 60;
            totalMinutes += stop.timeToSpendMinutes || 0;
        });

        // Add travel time between stops
        routeSegments.forEach((segment) => {
            if (segment.durationText) {
                const minutes = parseDurationToMinutes(segment.durationText);
                if (minutes) {
                    totalMinutes += minutes;
                }
            }
        });

        return formatTripDuration(totalMinutes);
    }, [plan.stops, routeSegments]);

    return (
        <div className="trip-detail-page">
            <div className="trip-detail-overlay" onClick={onClose} />
            <div className="trip-detail-container">
                <header className="trip-detail-header">
                    <button className="trip-detail-close" onClick={onClose}>
                        ×
                    </button>
                    <div className="trip-detail-title">
                        <h1>{plan.title || "Untitled Plan"}</h1>
                        <p className="trip-detail-meta">
                            Created{" "}
                            {new Date(plan.createdAt).toLocaleDateString()} •{" "}
                            {totalTripTime}
                        </p>
                    </div>
                </header>

                <div className="trip-detail-summary">
                    <h2>Trip Overview</h2>
                    <p>
                        {plan.summary || "No summary available for this trip."}
                    </p>
                </div>

                <div className="trip-detail-content">
                    <h2>Trip Itinerary</h2>
                    <ol className="trip-detail-stops">
                        {plan.stops.map((stop, index) => {
                            const nextStop = plan.stops[index + 1];

                            // Get segments from this stop to the next
                            const segmentsForStop = routeSegments
                                .filter((item) => item.fromIndex === index)
                                .sort((a, b) => a.toIndex - b.toIndex);

                            const primarySegment = segmentsForStop[0];
                            const overallLabel =
                                buildOverallPathLabel(segmentsForStop);
                            const travelSummary =
                                buildTotalSummary(segmentsForStop) ||
                                (nextStop
                                    ? fallbackTravelEstimate(
                                          stop.latitude,
                                          stop.longitude,
                                          nextStop.latitude,
                                          nextStop.longitude
                                      )
                                    : null);

                            const stopTimeDetails = getStopTimeDetails(stop);

                            return (
                                <li
                                    key={`${stop.label}-${index}`}
                                    className="trip-detail-stop"
                                >
                                    <div className="trip-detail-stop-marker">
                                        <span className="trip-detail-stop-node">
                                            {index + 1}
                                        </span>
                                        {nextStop && (
                                            <span className="trip-detail-stop-line" />
                                        )}
                                    </div>
                                    <div className="trip-detail-stop-content">
                                        <div className="trip-detail-stop-header">
                                            <h3 className="trip-detail-stop-title">
                                                {stop.displayName ||
                                                    stop.label ||
                                                    "Untitled stop"}
                                            </h3>
                                            {stopTimeDetails && (
                                                <span className="trip-detail-stop-time">
                                                    {stopTimeDetails}
                                                </span>
                                            )}
                                        </div>

                                        {(stop.notes || stop.description) && (
                                            <p className="trip-detail__stop-desc">
                                                {stop.notes || stop.description}
                                            </p>
                                        )}

                                        {stop.latitude && stop.longitude && (
                                            <div className="trip-detail-stop-location">
                                                <span className="trip-detail-location-label">
                                                    Location:
                                                </span>
                                                <span className="trip-detail-location-coords">
                                                    {stop.latitude.toFixed(4)},{" "}
                                                    {stop.longitude.toFixed(4)}
                                                </span>
                                            </div>
                                        )}

                                        {nextStop && travelSummary && (
                                            <div className="trip-detail-transit">
                                                <div className="trip-detail-transit-header">
                                                    <span
                                                        className={`trip-detail-transit-icon ${
                                                            primarySegment?.mode?.toLowerCase() ||
                                                            "transit"
                                                        }`}
                                                    >
                                                        {(
                                                            primarySegment?.mode ||
                                                            "T"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                    <div className="trip-detail-transit-info">
                                                        <span className="trip-detail-transit-mode">
                                                            {overallLabel ||
                                                                formatModeLabel(
                                                                    primarySegment?.mode ||
                                                                        "TRANSIT"
                                                                )}
                                                        </span>
                                                        <span className="trip-detail-transit-metrics">
                                                            {travelSummary}
                                                        </span>
                                                    </div>
                                                </div>

                                                {segmentsForStop.length > 1 && (
                                                    <div className="trip-detail-transit-segments">
                                                        <h4>
                                                            Detailed Transit
                                                        </h4>
                                                        <ul className="trip-detail-transit-steps">
                                                            {segmentsForStop.map(
                                                                (
                                                                    segment,
                                                                    segIdx
                                                                ) => (
                                                                    <li
                                                                        key={`segment-${index}-${segIdx}`}
                                                                        className="trip-detail-transit-step"
                                                                    >
                                                                        <div className="trip-detail-step-header">
                                                                            <span className="trip-detail-step-mode">
                                                                                {segment.lineName ||
                                                                                    formatModeLabel(
                                                                                        segment.mode
                                                                                    )}
                                                                            </span>
                                                                            <span className="trip-detail-step-duration">
                                                                                {segment.durationText ||
                                                                                    ""}
                                                                            </span>
                                                                        </div>
                                                                        {segment.instructions && (
                                                                            <p className="trip-detail-step-instructions">
                                                                                {
                                                                                    segment.instructions
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="trip-detail-footer">
                    <button className="trip-detail-action" onClick={onClose}>
                        Close
                    </button>
                    <button
                        className="trip-detail-action primary"
                        onClick={handlePrint}
                    >
                        Print Trip Details
                    </button>
                </div>
            </div>
        </div>
    );

    function handlePrint() {
        window.print();
    }
}

// Helper functions
function parseDurationToMinutes(text: string): number | null {
    // Accept variations like: "1h 5m", "1 h 5 min", "75 min", "2 hours 10 mins"
    const normalized = text.trim().toLowerCase();

    // Try hour + minute
    const hm = normalized.match(
        /(\d+)\s*h(?:our|ours)?\s*(\d+)?\s*m?(?:in|ins|inutes)?/
    );
    if (hm) {
        const h = parseInt(hm[1], 10);
        const m = hm[2] ? parseInt(hm[2], 10) : 0;
        if (Number.isFinite(h) && Number.isFinite(m)) return h * 60 + m;
    }

    // Try only hours
    const hOnly = normalized.match(/(\d+)\s*h(?:our|ours)?/);
    if (hOnly) {
        const h = parseInt(hOnly[1], 10);
        if (Number.isFinite(h)) return h * 60;
    }

    // Try only minutes
    const mOnly = normalized.match(/(\d+)\s*m(?:in|ins|inutes)?/);
    if (mOnly) {
        const m = parseInt(mOnly[1], 10);
        if (Number.isFinite(m)) return m;
    }

    return null;
}

function formatTripDuration(minutes: number): string {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;

    const parts = [];
    if (days > 0) {
        parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    }
    if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }
    if (mins > 0 || parts.length === 0) {
        parts.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);
    }

    return parts.join(", ");
}

function getStopTimeDetails(stop: PlanStop): string | null {
    const parts = [];

    if (stop.timeToSpendDays && stop.timeToSpendDays > 0) {
        parts.push(
            `${stop.timeToSpendDays} ${
                stop.timeToSpendDays === 1 ? "day" : "days"
            }`
        );
    }

    if (stop.timeToSpendHours && stop.timeToSpendHours > 0) {
        parts.push(
            `${stop.timeToSpendHours} ${
                stop.timeToSpendHours === 1 ? "hour" : "hours"
            }`
        );
    }

    if (stop.timeToSpendMinutes && stop.timeToSpendMinutes > 0) {
        parts.push(
            `${stop.timeToSpendMinutes} ${
                stop.timeToSpendMinutes === 1 ? "minute" : "minutes"
            }`
        );
    }

    return parts.length ? `Stay: ${parts.join(", ")}` : null;
}

function formatMinutes(minutes: number): string {
    if (minutes >= 60) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m ? `${h}h ${m}m` : `${h}h`;
    }
    return `${minutes} min`;
}

function buildOverallPathLabel(segments: RouteSegment[]): string | undefined {
    if (!segments.length) return undefined;

    const labels = segments.map((s) => {
        if (s.lineName && s.lineName.trim()) return s.lineName.trim();
        if (s.agency && s.agency.trim()) return s.agency.trim();
        return formatModeLabel(s.mode);
    });

    // Collapse consecutive duplicates
    const collapsed: string[] = [];
    for (const label of labels) {
        if (!collapsed.length || collapsed[collapsed.length - 1] !== label) {
            collapsed.push(label);
        }
    }

    // If everything is the same label, just show one
    const unique = Array.from(new Set(collapsed));
    if (unique.length === 1) return unique[0];

    // Otherwise, join with → to indicate transfers
    return collapsed.join(" → ");
}

function buildTotalSummary(segments: RouteSegment[]): string | null {
    if (!segments.length) return null;

    const minutes = segments
        .map((s) =>
            s.durationText ? parseDurationToMinutes(s.durationText) : null
        )
        .filter((v): v is number => typeof v === "number" && Number.isFinite(v))
        .reduce((acc, v) => acc + v, 0);

    if (!minutes || minutes <= 0) {
        return null;
    }

    const distance = segments
        .map((segment) => segment.distanceText?.trim())
        .find((value): value is string => Boolean(value));

    if (distance) {
        return `${formatMinutes(minutes)} • ${distance}`;
    }

    return formatMinutes(minutes);
}

function formatModeLabel(mode: string): string {
    switch (mode.toUpperCase()) {
        case "WALKING":
            return "Walk";
        case "DRIVING":
            return "Drive";
        case "BICYCLING":
            return "Bike";
        case "TRANSIT":
            return "Transit";
        default:
            return mode.charAt(0) + mode.slice(1).toLowerCase();
    }
}

function fallbackTravelEstimate(
    lat1?: number,
    lon1?: number,
    lat2?: number,
    lon2?: number
): string | null {
    if (
        lat1 === undefined ||
        lon1 === undefined ||
        lat2 === undefined ||
        lon2 === undefined
    ) {
        return null;
    }

    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = earthRadiusKm * c;

    if (!Number.isFinite(distanceKm)) {
        return null;
    }

    const averageSpeedKmh = 30;
    const minutes = Math.max(
        5,
        Math.round((distanceKm / averageSpeedKmh) * 60)
    );

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainder = minutes % 60;
        return `${hours}h${
            remainder ? ` ${remainder}m` : ""
        } • ${distanceKm.toFixed(1)} km`;
    }
    return `${minutes} min • ${distanceKm.toFixed(1)} km`;
}

function toRadians(value: number): number {
    return (value * Math.PI) / 180;
}

export default TripDetailPage;
