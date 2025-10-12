import { useMemo } from "react";
import { TravelPlan, RouteSegment, Folder } from "../App";
import "./InfoPanel.css";

type InfoPanelProps = {
    plan: TravelPlan | null;
    plans: TravelPlan[];
    selectedPlanId: string;
    onSelectPlan: (planId: string) => void;
    onUpdatePlanTitle: (planId: string, title: string) => void;
    onUpdatePlanSummary: (planId: string, summary: string) => void;
    onDeletePlan: (planId: string) => void;
    onViewDetails?: () => void;
    routeSegments: RouteSegment[];
    folders: Folder[];
    selectedFolderId: string;
    onSelectFolder: (folderId: string) => void;
};

function InfoPanel({
    plan,
    plans,
    folders,
    selectedFolderId,
    onSelectFolder,
    selectedPlanId,
    onSelectPlan,
    onUpdatePlanTitle,
    onUpdatePlanSummary,
    onDeletePlan,
    onViewDetails,
    routeSegments,
}: InfoPanelProps) {
    const handleTitleChange = (value: string) => {
        if (plan) {
            onUpdatePlanTitle(plan.id, value);
        }
    };

    const handleSummaryChange = (value: string) => {
        if (plan) {
            onUpdatePlanSummary(plan.id, value);
        }
    };

    const folderMap = useMemo(() => {
        const mapping = new Map<string, Folder[]>();
        folders.forEach((folder) => {
            if (folder.id === "all") {
                return;
            }
            folder.planIds.forEach((planId) => {
                if (!mapping.has(planId)) {
                    mapping.set(planId, []);
                }
                mapping.get(planId)!.push(folder);
            });
        });
        return mapping;
    }, [folders]);

    const activeFolder = useMemo(() => {
        return (
            folders.find((folder) => folder.id === selectedFolderId) ??
            folders[0] ?? { id: "all", name: "All Plans", planIds: [] }
        );
    }, [folders, selectedFolderId]);

    const displayedPlans = useMemo(() => {
        if (selectedFolderId === "all" || activeFolder.id === "all") {
            return plans;
        }
        return plans.filter((plan) => activeFolder.planIds.includes(plan.id));
    }, [plans, activeFolder, selectedFolderId]);

    const folderLabel = activeFolder.name;

    const handleGeneratePdf = async () => {
        if (!plan) {
            return;
        }

        try {
            const escapeHtml = (value: string) =>
                value.replace(/[&<>"]+/g, (match) => {
                    switch (match) {
                        case "&":
                            return "&amp;";
                        case "<":
                            return "&lt;";
                        case ">":
                            return "&gt;";
                        case '"':
                            return "&quot;";
                        default:
                            return match;
                    }
                });

            const title = plan.title || "Trip Plan";
            const summaryText = plan.summary || "No summary provided.";

            const stopsHtml = plan.stops
                .map((stop, index) => {
                    const nextStop = plan.stops[index + 1];
                    const segmentsForStop = routeSegments
                        .filter((item) => item.fromIndex === index)
                        .sort((a, b) => a.toIndex - b.toIndex);
                    const primarySegment = segmentsForStop[0];
                    const connectorLabel = segmentsForStop.length
                        ? buildOverallPathLabel(segmentsForStop) ||
                          (primarySegment?.mode
                              ? formatModeLabel(primarySegment.mode)
                              : undefined)
                        : undefined;
                    const travelSummary = segmentsForStop.length
                        ? buildTotalSummary(segmentsForStop)
                        : nextStop
                        ? fallbackTravelEstimate(
                              stop.latitude,
                              stop.longitude,
                              nextStop.latitude,
                              nextStop.longitude
                          )
                        : null;

                    const pieces: string[] = [];
                    const stopTitle =
                        stop.displayName || stop.label || "Untitled stop";
                    pieces.push(
                        `<h3>${escapeHtml(`${index + 1}. ${stopTitle}`)}</h3>`
                    );
                    const stopText = stop.notes || stop.description;
                    if (stopText) {
                        pieces.push(`<p>${escapeHtml(stopText)}</p>`);
                    }
                    if (travelSummary) {
                        pieces.push(
                            `<p><strong>Travel:</strong> ${escapeHtml(
                                connectorLabel || "Transit"
                            )} • ${escapeHtml(travelSummary)}</p>`
                        );
                    }
                    // Simplified: no per-segment instructions in PDF
                    if (
                        typeof stop.latitude === "number" &&
                        Number.isFinite(stop.latitude) &&
                        typeof stop.longitude === "number" &&
                        Number.isFinite(stop.longitude)
                    ) {
                        pieces.push(
                            `<p class="coords">Coordinates: ${stop.latitude.toFixed(
                                4
                            )}, ${stop.longitude.toFixed(4)}</p>`
                        );
                    }
                    return `<section class="stop">${pieces.join("")}</section>`;
                })
                .join("");

            const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 32px; color: #1f2237; }
      h1 { font-size: 24px; margin-bottom: 8px; }
      h2 { font-size: 18px; margin-top: 24px; }
      p { line-height: 1.5; margin: 6px 0; }
      .summary { margin-bottom: 18px; }
      .stop { border-bottom: 1px solid #d5d8f0; padding: 12px 0; }
      .stop:last-child { border-bottom: none; }
      .stop h3 { margin: 0 0 6px; font-size: 16px; }
      .note { font-style: italic; color: #3f4370; }
      .coords { color: #3f4370; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <section class="summary">
      <h2>Overview</h2>
      <p>${escapeHtml(summaryText)}</p>
      <p><small>Updated ${new Date(
          plan.createdAt
      ).toLocaleDateString()}</small></p>
    </section>
    <section>
      <h2>Stops</h2>
            ${stopsHtml || "<p>No stops yet.</p>"}
    </section>
  </body>
</html>`;

            const popup = window.open("", "_blank", "width=900,height=700");
            if (!popup) {
                console.error("Unable to open a print window for PDF export.");
                return;
            }
            popup.document.write(html);
            popup.document.close();
            popup.focus();
            popup.print();
        } catch (error) {
            console.error("Failed to generate PDF", error);
        }
    };

    return (
        <div className="info">
            <header className="info__header">
                <div className="info__header-text">
                    <p className="info__eyebrow">Trip Summary</p>
                    {plan ? (
                        <input
                            className="info__title-input"
                            type="text"
                            value={plan.title}
                            onChange={(event) =>
                                handleTitleChange(event.target.value)
                            }
                            placeholder="Name this plan"
                        />
                    ) : (
                        <h2>Select a plan</h2>
                    )}
                </div>
            </header>

            <section className="info__section info__section--summary">
                <h3>Overview</h3>
                {plan ? (
                    <>
                        <textarea
                            className="info__summary-input"
                            value={plan.summary}
                            onChange={(event) =>
                                handleSummaryChange(event.target.value)
                            }
                            placeholder="Summarize this itinerary so teammates know what to expect."
                            rows={3}
                        />
                        <p className="info__meta">
                            Updated{" "}
                            {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                        <div className="info__summary-actions">
                            <button
                                type="button"
                                className="info__pdf-button"
                                onClick={handleGeneratePdf}
                            >
                                Download PDF
                            </button>
                            <button
                                type="button"
                                className="info__view-details"
                                onClick={() => onViewDetails && onViewDetails()}
                            >
                                View Details
                            </button>
                            <button
                                type="button"
                                className="info__delete-plan"
                                onClick={() => onDeletePlan(plan.id)}
                            >
                                Delete Plan
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Choose a plan to see its highlights and waypoints.</p>
                )}
            </section>

            <section className="info__section info__section--stops">
                <h3>Today's Stops</h3>
                <ol className="info__stops">
                    {plan?.stops?.length ? (
                        plan.stops.map((stop, index) => {
                            const nextStop = plan.stops[index + 1];
                            const segmentsForStop = routeSegments
                                .filter((item) => item.fromIndex === index)
                                .sort((a, b) => a.toIndex - b.toIndex);
                            const primarySegment = segmentsForStop[0];
                            const overallLabel = segmentsForStop.length
                                ? buildOverallPathLabel(segmentsForStop) ||
                                  (primarySegment?.mode
                                      ? formatModeLabel(primarySegment.mode)
                                      : undefined)
                                : undefined;
                            const travelSummary = segmentsForStop.length
                                ? buildTotalSummary(segmentsForStop)
                                : nextStop
                                ? fallbackTravelEstimate(
                                      stop.latitude,
                                      stop.longitude,
                                      nextStop.latitude,
                                      nextStop.longitude
                                  )
                                : null;
                            const connectorLabel = overallLabel;
                            const connectorIconText = (
                                primarySegment?.mode || "TRANSIT"
                            ).slice(0, 1);

                            const stopTitle =
                                stop.displayName ||
                                stop.label ||
                                "Untitled stop";
                            return (
                                <li
                                    key={`${stopTitle}-${index}`}
                                    className="info__stop-card"
                                >
                                    <div className="info__stop-marker">
                                        <span className="info__stop-node" />
                                        {nextStop ? (
                                            <span className="info__stop-line" />
                                        ) : null}
                                    </div>
                                    <div className="info__stop-content">
                                        <span className="info__stop-title">
                                            {stopTitle}
                                        </span>
                                        {stop.notes || stop.description ? (
                                            <span className="info__stop-desc">
                                                {stop.notes || stop.description}
                                            </span>
                                        ) : null}
                                        {travelSummary ? (
                                            <div
                                                className="info__stop-connector"
                                                aria-hidden
                                            >
                                                <span className="info__connector-icon">
                                                    {connectorIconText}
                                                </span>
                                                <div>
                                                    <span className="info__connector-mode">
                                                        {connectorLabel ||
                                                            "Transit"}
                                                    </span>
                                                    <span className="info__connector-metrics">
                                                        {travelSummary}
                                                    </span>
                                                    {/* Simplified per user request: hide per-segment steps and instructions */}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="info__empty">
                            Add a stop to build out your itinerary.
                        </li>
                    )}
                </ol>
            </section>

            <section className="info__section info__section--history">
                <div className="info__history-header">
                    <div>
                        <h3>Plan Library</h3>
                        <span className="info__history-hint">
                            Browse plans by folder or quick access.
                        </span>
                    </div>
                    <label className="info__folder-filter">
                        <span>Folder</span>
                        <select
                            className="info__folder-select"
                            value={selectedFolderId}
                            onChange={(event) =>
                                onSelectFolder(event.target.value)
                            }
                        >
                            <option value="all">All plans</option>
                            {folders
                                .filter((folder) => folder.id !== "all")
                                .map((folder) => (
                                    <option key={folder.id} value={folder.id}>
                                        {folder.name}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>
                <ul className="info__plans info__plans--scroll">
                    {displayedPlans.length ? (
                        displayedPlans.map((item) => {
                            const associatedFolders =
                                folderMap.get(item.id) ?? [];
                            return (
                                <li key={item.id} className="info__plan-row">
                                    <button
                                        type="button"
                                        className={
                                            item.id === selectedPlanId
                                                ? "info__plan info__plan--active"
                                                : "info__plan"
                                        }
                                        onClick={() => onSelectPlan(item.id)}
                                    >
                                        <span className="info__plan-title">
                                            {item.title || "Untitled Plan"}
                                        </span>
                                        <span className="info__plan-meta">
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                        <div className="info__plan-tags">
                                            {associatedFolders.length ? (
                                                associatedFolders.map(
                                                    (folder) => (
                                                        <span
                                                            key={folder.id}
                                                            className="info__plan-tag"
                                                        >
                                                            {folder.name}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="info__plan-tag info__plan-tag--empty">
                                                    Unassigned
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        className="info__plan-remove"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onDeletePlan(item.id);
                                        }}
                                        aria-label={`Remove ${
                                            item.title || "untitled plan"
                                        }`}
                                    >
                                        ✕
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                        <li className="info__empty">
                            {selectedFolderId === "all"
                                ? "No saved plans yet."
                                : `"${folderLabel}" has no plans yet.`}
                        </li>
                    )}
                </ul>
            </section>
        </div>
    );
}

export default InfoPanel;

function buildTravelSummary(segments: RouteSegment[]): string | null {
    const durations = Array.from(
        new Set(
            segments
                .map((segment) => segment.durationText?.trim())
                .filter((value): value is string => Boolean(value))
        )
    );

    const distance = segments
        .map((segment) => segment.distanceText?.trim())
        .find((value): value is string => Boolean(value));

    if (durations.length && distance) {
        return `${durations.join(" + ")} • ${distance}`;
    }

    if (durations.length) {
        return durations.join(" + ");
    }

    return distance ?? null;
}

// Build a concise label representing the overall path across segments
function buildOverallPathLabel(segments: RouteSegment[]): string | undefined {
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

// Summarize only the total transit time across all segments
function buildTotalSummary(segments: RouteSegment[]): string | null {
    const minutes = segments
        .map((s) =>
            s.durationText ? parseDurationToMinutes(s.durationText) : null
        )
        .filter((v): v is number => typeof v === "number" && Number.isFinite(v))
        .reduce((acc, v) => acc + v, 0);

    if (!minutes || minutes <= 0) {
        return null;
    }

    return formatMinutes(minutes);
}

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

function formatMinutes(minutes: number): string {
    if (minutes >= 60) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m ? `${h}h ${m}m` : `${h}h`;
    }
    return `${minutes} min`;
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
        return `${hours}h${remainder ? ` ${remainder}m` : ""}`;
    }
    return `${minutes} min`;
}

function toRadians(value: number): number {
    return (value * Math.PI) / 180;
}
