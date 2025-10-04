import { TravelPlan } from '../App';
import './InfoPanel.css';

type InfoPanelProps = {
  plan: TravelPlan | null;
  plans: TravelPlan[];
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
};

function InfoPanel({ plan, plans, selectedPlanId, onSelectPlan}: InfoPanelProps) {
  return (
    <div className="info">
      <header className="info__header">
        <div>
          <p className="info__eyebrow">Trip Summary</p>
          <h2>{plan?.title ?? 'Select a plan'}</h2>
        </div>
      </header>

      <section className="info__section info__section--summary">
        <h3>Overview</h3>
        <p>{plan?.summary ?? 'Choose a plan to see its highlights and waypoints.'}</p>
        {plan ? <p className="info__meta">Updated {new Date(plan.createdAt).toLocaleDateString()}</p> : null}
      </section>

      <section className="info__section info__section--stops">
        <h3>Today's Stops</h3>
        <ol className="info__stops">
          {plan?.stops?.length ? (
            plan.stops.map((stop, index) => (
              <li key={stop.label + index}>
                <span className="info__stop-number">{index + 1}</span>
                <div>
                  <span className="info__stop-title">{stop.label}</span>
                  {stop.description ? <span className="info__stop-desc">{stop.description}</span> : null}
                </div>
              </li>
            ))
          ) : (
            <li className="info__empty">Add a stop to build out your itinerary.</li>
          )}
        </ol>
      </section>

      <section className="info__section info__section--history">
        <h3>Plan Library</h3>
        <ul className="info__plans">
          {plans.length ? (
            plans.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={item.id === selectedPlanId ? 'info__plan info__plan--active' : 'info__plan'}
                  onClick={() => onSelectPlan(item.id)}
                >
                  <span className="info__plan-title">{item.title}</span>
                  <span className="info__plan-meta">{new Date(item.createdAt).toLocaleDateString()}</span>
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
