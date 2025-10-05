import type { PlanStop, TripAdvisorInfo } from '../App';
import './TripAdvisor.css';

type TripAdvisorProps = {
  selectedStop: PlanStop | null;
  info: TripAdvisorInfo | null;
  stops: PlanStop[];
  isLoading: boolean;
  error: string | null;
};

function TripAdvisor({ selectedStop, info, stops, isLoading, error }: TripAdvisorProps) {
  return (
    <section className="advisor">
      <header className="advisor__header">
        <div>
          <p className="advisor__eyebrow">Trip Advisor</p>
          <h3>{selectedStop ? selectedStop.label : 'Select a stop to see details'}</h3>
        </div>
      </header>

      {error ? <div className="advisor__error">{error}</div> : null}

      {isLoading ? (
        <div className="advisor__loading">Gathering local insights…</div>
      ) : info ? (
        <div className="advisor__content">
          <p className="advisor__summary">{info.summary}</p>

          <div className="advisor__section">
            <h4>Nearby Restaurants</h4>
            <ul>
              {info.nearbyRestaurants.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="advisor__section">
            <h4>Nearby Attractions</h4>
            <ul>
              {info.nearbyAttractions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="advisor__section">
            <h4>Stay Options</h4>
            <ul>
              {info.nearbyHotels.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="advisor__placeholder">
          <p>Select one of the stops in your itinerary to see tailored suggestions.</p>
          {stops.length ? (
            <ol>
              {stops.map((stop, index) => (
                <li key={stop.label + index}>{stop.label}</li>
              ))}
            </ol>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default TripAdvisor;
