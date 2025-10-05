import { useMemo } from 'react';
import { TravelPlan, RouteSegment, Folder } from '../App';
import './InfoPanel.css';

type InfoPanelProps = {
  plan: TravelPlan | null;
  plans: TravelPlan[];
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
  onUpdatePlanTitle: (planId: string, title: string) => void;
  onUpdatePlanSummary: (planId: string, summary: string) => void;
  onDeletePlan: (planId: string) => void;
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
      if (folder.id === 'all') {
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
      folders[0] ?? { id: 'all', name: 'All Plans', planIds: [] }
    );
  }, [folders, selectedFolderId]);

  const displayedPlans = useMemo(() => {
    if (selectedFolderId === 'all' || activeFolder.id === 'all') {
      return plans;
    }
    return plans.filter((plan) => activeFolder.planIds.includes(plan.id));
  }, [plans, activeFolder, selectedFolderId]);

  const folderLabel = activeFolder.name;
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
              onChange={(event) => handleTitleChange(event.target.value)}
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
              onChange={(event) => handleSummaryChange(event.target.value)}
              placeholder="Summarize this itinerary so teammates know what to expect."
              rows={3}
            />
            <p className="info__meta">
              Updated {new Date(plan.createdAt).toLocaleDateString()}
            </p>
            <button
              type="button"
              className="info__delete-plan"
              onClick={() => onDeletePlan(plan.id)}
            >
              Delete Plan
            </button>
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
              const segment = routeSegments.find((item) => item.fromIndex === index);
              const travelSummary = segment?.durationText
                ? segment.distanceText
                  ? `${segment.durationText} • ${segment.distanceText}`
                  : segment.durationText
                : nextStop
                ? fallbackTravelEstimate(
                    stop.latitude,
                    stop.longitude,
                    nextStop.latitude,
                    nextStop.longitude
                  )
                : null;
              const connectorLabel =
                segment?.lineName ||
                segment?.agency ||
                (segment?.mode ? formatModeLabel(segment.mode) : undefined);
              const connectorIconText = (segment?.mode || 'TRANSIT').slice(0, 1);

              return (
                <li key={stop.label + index} className="info__stop-card">
                  <div className="info__stop-marker">
                    <span className="info__stop-node" />
                    {nextStop ? <span className="info__stop-line" /> : null}
                  </div>
                  <div className="info__stop-content">
                    <span className="info__stop-title">{stop.label || 'Untitled stop'}</span>
                    {stop.description ? (
                      <span className="info__stop-desc">{stop.description}</span>
                    ) : null}
                    {travelSummary ? (
                      <div className="info__stop-connector" aria-hidden>
                        <span className="info__connector-icon">{connectorIconText}</span>
                        <div>
                          <span className="info__connector-mode">{connectorLabel || 'Transit'}</span>
                          <span className="info__connector-metrics">{travelSummary}</span>
                          {segment?.instructions ? (
                            <span className="info__connector-note">{segment.instructions}</span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="info__empty">Add a stop to build out your itinerary.</li>
          )}
        </ol>
      </section>

      <section className="info__section info__section--history">
        <div className="info__history-header">
          <div>
            <h3>Plan Library</h3>
            <span className="info__history-hint">Browse plans by folder or quick access.</span>
          </div>
          <label className="info__folder-filter">
            <span>Folder</span>
            <select
              className="info__folder-select"
              value={selectedFolderId}
              onChange={(event) => onSelectFolder(event.target.value)}
            >
              <option value="all">All plans</option>
              {folders
                .filter((folder) => folder.id !== 'all')
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
              const associatedFolders = folderMap.get(item.id) ?? [];
              return (
                <li key={item.id} className="info__plan-row">
                  <button
                    type="button"
                    className={
                      item.id === selectedPlanId ? 'info__plan info__plan--active' : 'info__plan'
                    }
                    onClick={() => onSelectPlan(item.id)}
                  >
                    <span className="info__plan-title">{item.title || 'Untitled Plan'}</span>
                    <span className="info__plan-meta">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="info__plan-tags">
                      {associatedFolders.length ? (
                        associatedFolders.map((folder) => (
                          <span key={folder.id} className="info__plan-tag">
                            {folder.name}
                          </span>
                        ))
                      ) : (
                        <span className="info__plan-tag info__plan-tag--empty">Unassigned</span>
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
                    aria-label={`Remove ${item.title || 'untitled plan'}`}
                  >
                    ✕
                  </button>
                </li>
              );
            })
          ) : (
            <li className="info__empty">
              {selectedFolderId === 'all'
                ? 'No saved plans yet.'
                : `"${folderLabel}" has no plans yet.`}
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default InfoPanel;

function formatModeLabel(mode: string): string {
  switch (mode.toUpperCase()) {
    case 'WALKING':
      return 'Walk';
    case 'DRIVING':
      return 'Drive';
    case 'BICYCLING':
      return 'Bike';
    case 'TRANSIT':
      return 'Transit';
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
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = earthRadiusKm * c;

  if (!Number.isFinite(distanceKm)) {
    return null;
  }

  const averageSpeedKmh = 30;
  const minutes = Math.max(5, Math.round((distanceKm / averageSpeedKmh) * 60));

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return `${hours}h${remainder ? ` ${remainder}m` : ''}`;
  }
  return `${minutes} min`;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}