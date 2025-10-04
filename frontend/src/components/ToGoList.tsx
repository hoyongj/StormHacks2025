import type { TravelPlan } from '../App';
import './ToGoList.css';

type ToGoListProps = {
  plan: TravelPlan | null;
};

function ToGoList({ plan }: ToGoListProps) {
  const stops = plan?.stops ?? [];

  return (
    <section className="to-go">
      <header className="to-go__header">
        <p className="to-go__eyebrow">To Go</p>
        <h3>{plan ? 'Upcoming stops' : 'Pick a plan to see your route'}</h3>
      </header>
      <ol className="to-go__list">
        {stops.length ? (
          stops.map((stop, index) => (
            <li key={stop.label + index}>
              <span className="to-go__step">{index + 1}</span>
              <div>
                <span className="to-go__title">{stop.label}</span>
                {stop.description ? <span className="to-go__desc">{stop.description}</span> : null}
              </div>
            </li>
          ))
        ) : (
          <li className="to-go__empty">Add stops to start crafting your day.</li>
        )}
      </ol>
    </section>
  );
}

export default ToGoList;
