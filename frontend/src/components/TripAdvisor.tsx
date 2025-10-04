import type { TravelPlan } from '../App';
import './TripAdvisor.css';

type TripAdvisorProps = {
  plan: TravelPlan | null;
};

function TripAdvisor({ plan }: TripAdvisorProps) {
  const stops = plan?.stops ?? [];

  return (
    <section className="advisor">
      <header className="advisor__header">
        <div>
          <p className="advisor__eyebrow">Trip Advisor</p>
          <h3>{plan ? `Stops for ${plan.title}` : 'Pick a plan to see suggested stops'}</h3>
        </div>
        <button type="button" className="advisor__sync" disabled>
          Coming Soon
        </button>
      </header>

      <ol className="advisor__list">
        {stops.length ? (
          stops.map((stop, index) => (
            <li key={stop.label + index} className="advisor__item">
              <span className="advisor__number">{index + 1}</span>
              <div className="advisor__details">
                <span className="advisor__title">{stop.label}</span>
                {stop.description ? <span className="advisor__summary">{stop.description}</span> : null}
              </div>
              <button type="button" className="advisor__action" disabled>
                Save
              </button>
            </li>
          ))
        ) : (
          <li className="advisor__empty">Add stops to see them listed here.</li>
        )}
      </ol>
    </section>
  );
}

export default TripAdvisor;
