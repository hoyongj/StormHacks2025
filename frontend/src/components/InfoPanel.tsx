import { TravelPlan } from '../App';
import './InfoPanel.css';

type InfoPanelProps = {
  plan: TravelPlan | null;
  plans: TravelPlan[];
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
  onUpdatePlanTitle: (planId: string, title: string) => void;
  onUpdatePlanSummary: (planId: string, summary: string) => void;
  onCreatePlan: () => void;
  onDeletePlan: (planId: string) => void;
};

function InfoPanel({
  plan,
  plans,
  selectedPlanId,
  onSelectPlan,
  onUpdatePlanTitle,
  onUpdatePlanSummary,
  onCreatePlan,
  onDeletePlan,
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
        <button type="button" className="info__create" onClick={onCreatePlan}>
          New Blank Plan
        </button>
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
            <p className="info__meta">Updated {new Date(plan.createdAt).toLocaleDateString()}</p>
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
            plan.stops.map((stop, index) => (
              <li key={stop.label + index}>
                <span className="info__stop-number">{index + 1}</span>
                <div>
                  <span className="info__stop-title">{stop.label || 'Untitled stop'}</span>
                  {stop.description ? <span className="info__stop-desc">{stop.description}</span> : null}
                  {stop.latitude !== undefined && stop.longitude !== undefined ? (
                    <span className="info__stop-coordinates">
                      {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                    </span>
                  ) : null}
                </div>
              </li>
            ))
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
                  className={item.id === selectedPlanId ? 'info__plan info__plan--active' : 'info__plan'}
                  onClick={() => onSelectPlan(item.id)}
                >
                  <span className="info__plan-title">{item.title || 'Untitled Plan'}</span>
                  <span className="info__plan-meta">{new Date(item.createdAt).toLocaleDateString()}</span>
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
