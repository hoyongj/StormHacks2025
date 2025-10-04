import { TravelPlan } from '../App';
import './InfoPanel.css';

type InfoPanelProps = {
  plan: TravelPlan | null;
};

function InfoPanel({ plan }: InfoPanelProps) {
  return (
    <div className="info">
      <section className="info__user">
        <div className="info__avatar">J</div>
        <div>
          <h3>James</h3>
          <p>Premium Traveler</p>
        </div>
      </section>

      <section className="info__section">
        <h4>Trip Summary</h4>
        <p>{plan?.summary ?? 'Select a plan or generate a new one to view the summary.'}</p>
      </section>

      <section className="info__section">
        <h4>Upcoming Stops</h4>
        <ul>
          {plan?.stops?.length ? (
            plan.stops.map((stop, index) => <li key={stop.label + index}>{stop.label}</li>)
          ) : (
            <li>No stops yet. Start planning!</li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default InfoPanel;
