import { TravelPlan } from '../App';
import './MapView.css';

type MapViewProps = {
  plan: TravelPlan | null;
};

function MapView({ plan }: MapViewProps) {
  if (!plan) {
    return (
      <div className="map">
        <div className="map__empty">Select a plan to preview the route.</div>
      </div>
    );
  }

  return (
    <div className="map">
      <div className="map__placeholder">
        <span className="map__label">Route Overview</span>
        <ol>
          {plan.stops.map((stop, index) => (
            <li key={stop.label + index}>
              <span className="map__stop-title">{stop.label}</span>
              {stop.description ? <span className="map__stop-desc">{stop.description}</span> : null}
            </li>
          ))}
        </ol>
        <p className="map__hint">Google Maps visualization coming soon.</p>
      </div>
    </div>
  );
}

export default MapView;
