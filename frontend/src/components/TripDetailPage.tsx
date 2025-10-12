import React, { useEffect, useMemo } from "react";
import { TravelPlan, RouteSegment, PlanStop } from "../App";
import "./TripDetailPage.css";
import "./TripDetailPage-print.css";

// Updated implementation to match the vertical timeline design
type TripDetailPageProps = {
    plan: TravelPlan;
    routeSegments: RouteSegment[];
    onClose: () => void;
};

export default function TripDetailPage({
    plan,
    routeSegments,
    onClose,
}: TripDetailPageProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.classList.add("modal-open");
        return () => document.body.classList.remove("modal-open");
    }, []);

    const totalTripTime = useMemo(() => {
        let minutes = 0;
        for (const stop of plan.stops) {
            minutes += (stop.timeToSpendDays || 0) * 24 * 60;
            minutes += (stop.timeToSpendHours || 0) * 60;
            minutes += stop.timeToSpendMinutes || 0;
        }
        for (const seg of routeSegments) {
            if (seg.durationText) {
                const m = parseDurationToMinutes(seg.durationText);
                if (m) minutes += m;
            }
        }
        return formatTripDuration(minutes);
    }, [plan.stops, routeSegments]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="trip-detail-page">
            <div className="trip-detail-overlay no-print" onClick={onClose} />
            <div className="trip-detail-container">
                <header className="trip-detail-header no-print">
                    <button onClick={onClose} className="trip-detail-close">
                        ×
                    </button>
                    <div className="trip-detail-title">
                        <h1>{plan.title || "Untitled Plan"}</h1>
                        <p className="trip-detail-meta">{totalTripTime}</p>
                    </div>
                </header>

                <main
                    className="trip-detail-content"
                    data-plan-title={plan.title || "Untitled Plan"}
                >
                    <h2>Itinerary</h2>
                    <div className="trip-detail-timeline">
                        {plan.stops.map((stop, index) => {
                            const nextStop = plan.stops[index + 1];
                            // Get segments that START from this stop
                            const stopSegments = routeSegments.filter(
                                (s) => s.fromIndex === index
                            );
                            const travelInfo = getTravelInfo(stopSegments);

                            return (
                                <div
                                    key={`${
                                        stop.label || stop.displayName
                                    }-${index}`}
                                    className="trip-detail-stop"
                                >
                                    <div className="trip-detail-stop-marker">
                                        <div className="trip-detail-stop-circle">
                                            {index + 1}
                                        </div>
                                        {nextStop && (
                                            <div className="trip-detail-stop-line"></div>
                                        )}
                                    </div>
                                    <div className="trip-detail-stop-content">
                                        <h3>
                                            {stop.displayName || stop.label}
                                        </h3>
                                        {stop.description && (
                                            <div className="trip-detail-stop-address">
                                                {stop.description}
                                            </div>
                                        )}
                                        {getStopTimeDetails(stop) && (
                                            <div className="trip-detail-stop-time">
                                                {getStopTimeDetails(stop)}
                                            </div>
                                        )}
                                        {stop.notes && (
                                            <div className="trip-detail-stop-notes">
                                                {stop.notes}
                                            </div>
                                        )}

                                        {nextStop &&
                                            stopSegments.length > 0 && (
                                                <div className="trip-detail-travel-info">
                                                    <div className="trip-detail-travel-time">
                                                        {getTravelInfo(
                                                            stopSegments
                                                        )}
                                                    </div>

                                                    {/* Display detailed instructions for this leg */}
                                                    <div className="trip-detail-travel-segments">
                                                        {stopSegments.map(
                                                            (seg, idx) => {
                                                                // Only show segments for this specific route leg
                                                                if (
                                                                    seg.fromIndex ===
                                                                        index &&
                                                                    seg.toIndex ===
                                                                        index +
                                                                            1
                                                                ) {
                                                                    return (
                                                                        <div
                                                                            key={`segment-${index}-${idx}`}
                                                                            className="trip-detail-travel-segment"
                                                                        >
                                                                            <div className="trip-detail-travel-segment-mode">
                                                                                {getTravelModeIcon(
                                                                                    seg.mode
                                                                                )}
                                                                                <span>
                                                                                    {getTravelModeLabel(
                                                                                        seg.mode
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <div className="trip-detail-travel-segment-info">
                                                                                {seg.instructions && (
                                                                                    <div className="trip-detail-travel-instructions">
                                                                                        {
                                                                                            seg.instructions
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                                <div className="trip-detail-travel-segment-duration">
                                                                                    {seg.durationText ||
                                                                                        ""}
                                                                                    {seg.distanceText
                                                                                        ? ` • ${seg.distanceText}`
                                                                                        : ""}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>

                <footer className="trip-detail-footer no-print">
                    <button onClick={onClose} className="trip-detail-action">
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="trip-detail-action primary"
                    >
                        Print Trip Details
                    </button>
                </footer>
            </div>
        </div>
    );
}

// Helpers
function parseDurationToMinutes(text?: string | null): number | null {
    if (!text) return null;
    const normalized = text.trim().toLowerCase();
    const hm = normalized.match(
        /(\d+)\s*h(?:ou?r?s?)?\s*(?:and\s*)?(\d+)?\s*m?/
    );
    if (hm) return parseInt(hm[1], 10) * 60 + (hm[2] ? parseInt(hm[2], 10) : 0);
    const mOnly = normalized.match(/(\d+)\s*m(?:in(?:ute)?s?)?/);
    if (mOnly) return parseInt(mOnly[1], 10);
    return null;
}

function formatTripDuration(minutes: number): string {
    if (!Number.isFinite(minutes)) return "";
    const d = Math.floor(minutes / (24 * 60));
    const h = Math.floor((minutes % (24 * 60)) / 60);
    const m = minutes % 60;
    return (
        [d ? `${d}d` : null, h ? `${h}h` : null, m ? `${m}m` : null]
            .filter(Boolean)
            .join(" ") || "0m"
    );
}

function getStopTimeDetails(stop: PlanStop): string | null {
    const parts: string[] = [];
    if (typeof stop.timeToSpendDays === "number" && stop.timeToSpendDays > 0)
        parts.push(`${stop.timeToSpendDays}d`);
    if (typeof stop.timeToSpendHours === "number" && stop.timeToSpendHours > 0)
        parts.push(`${stop.timeToSpendHours}h`);
    if (
        typeof stop.timeToSpendMinutes === "number" &&
        stop.timeToSpendMinutes > 0
    )
        parts.push(`${stop.timeToSpendMinutes}m`);
    return parts.length ? parts.join(" ") : null;
}

function getTravelModeIcon(mode?: string): string {
    switch (mode?.toLowerCase()) {
        case "walking":
        case "walk":
            return "🚶";
        case "bicycling":
        case "bicycle":
            return "🚲";
        case "driving":
        case "drive":
            return "🚗";
        case "transit":
        case "bus":
            return "🚍";
        case "train":
            return "🚆";
        case "subway":
            return "🚇";
        default:
            return "➡️";
    }
}

function getTravelModeLabel(mode?: string): string {
    if (!mode) return "Travel";
    const m = mode.toLowerCase();
    if (m === "walking" || m === "walk") return "Walk";
    if (m === "driving" || m === "drive") return "Drive";
    if (m === "bicycling" || m === "bicycle") return "Bike";
    if (m === "transit") return "Transit";
    if (m === "bus") return "Bus";
    if (m === "train") return "Train";
    if (m === "subway") return "Subway";
    if (m === "tram") return "Tram";
    if (m === "ferry") return "Ferry";
    if (m === "expo" || m.includes("expo")) return "SkyTrain - Expo Line";
    if (m.includes("canada")) return "SkyTrain - Canada Line";
    if (m.includes("millennium")) return "SkyTrain - Millennium Line";
    return mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
}

function getTravelInfo(segments: RouteSegment[]): string | null {
    if (!segments.length) return null;

    let totalMinutes = 0;
    let totalDistance = "";

    for (const seg of segments) {
        if (seg.durationText) {
            const minutes = parseDurationToMinutes(seg.durationText);
            if (minutes) totalMinutes += minutes;
        }
        if (seg.distanceText && !totalDistance) {
            totalDistance = seg.distanceText;
        }
    }

    if (totalMinutes === 0) return null;

    const formattedDuration = formatTripDuration(totalMinutes);
    return totalDistance
        ? `Total: ${formattedDuration} • ${totalDistance}`
        : `Total: ${formattedDuration}`;
}
