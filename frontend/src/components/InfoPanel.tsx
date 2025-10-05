import { TravelPlan, RouteSegment } from '../App';
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
};

function InfoPanel({
  plan,
  plans,
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
                          <span className="info__connector-mode">
                            {connectorLabel || 'Transit'}
                          </span>
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
          <h3>Plan Library</h3>
          <span className="info__history-hint">Tap to switch, remove plans you no longer need.</span>
        </div>
        <ul className="info__plans">
          {plans.length ? (
            plans.map((item) => (
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
            ))
          ) : (
            <li className="info__empty">No saved plans yet.</li>
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
