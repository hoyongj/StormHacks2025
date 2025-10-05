import type { KeyboardEvent } from 'react';
import type { PlanStop, TripAdvisorInfo, TripAdvisorSuggestion } from '../App';
import './TripAdvisor.css';

type TripAdvisorProps = {
  selectedStop: PlanStop | null;
  info: TripAdvisorInfo | null;
  stops: PlanStop[];
  isLoading: boolean;
  error: string | null;
  onAddSuggestion?: (suggestion: TripAdvisorSuggestion) => void;
<<<<<<< HEAD
=======
  isAddingSuggestion?: boolean;
>>>>>>> polyline
};

const HINT_LOOKUP: Record<'eat' | 'see' | 'stay', string> = {
  eat: 'Popular with diners nearby.',
  see: 'Great detour if you have a spare hour.',
  stay: 'Consider booking early—demand is high in peak season.',
};

<<<<<<< HEAD
function TripAdvisor({ selectedStop, info, stops, isLoading, error, onAddSuggestion }: TripAdvisorProps) {
=======
function TripAdvisor({
  selectedStop,
  info,
  stops,
  isLoading,
  error,
  onAddSuggestion,
  isAddingSuggestion = false,
}: TripAdvisorProps) {
>>>>>>> polyline
  const sections: { title: string; items: TripAdvisorSuggestion[]; intent: 'eat' | 'see' | 'stay' }[] = info
    ? [
        { title: 'Nearby Restaurants', items: info.nearbyRestaurants, intent: 'eat' },
        { title: 'Nearby Attractions', items: info.nearbyAttractions, intent: 'see' },
        { title: 'Stay Options', items: info.nearbyHotels, intent: 'stay' },
      ]
    : [];

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

          <div className="advisor__grid">
            {sections.map((section) => (
              <div className="advisor__section" key={section.title}>
                <h4>{section.title}</h4>
                <ul>
                  {section.items.length ? (
                    section.items.map((item) => (
                      <LineItem
                        key={`${section.title}-${item.name}`}
                        suggestion={item}
                        intent={section.intent}
                        onAdd={onAddSuggestion}
<<<<<<< HEAD
=======
                        disabled={isAddingSuggestion}
>>>>>>> polyline
                      />
                    ))
                  ) : (
                    <li className="advisor__empty-item">Nothing nearby detected yet.</li>
                  )}
                </ul>
              </div>
            ))}
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

type LineItemProps = {
  suggestion: TripAdvisorSuggestion;
  intent: 'eat' | 'see' | 'stay';
  onAdd?: (suggestion: TripAdvisorSuggestion) => void;
<<<<<<< HEAD
};

function LineItem({ suggestion, intent, onAdd }: LineItemProps) {
=======
  disabled?: boolean;
};

function LineItem({ suggestion, intent, onAdd, disabled }: LineItemProps) {
>>>>>>> polyline
  const rating = suggestion.rating ? `${suggestion.rating.toFixed(1)}★` : 'No rating yet';
  const total = suggestion.totalRatings ? `(${suggestion.totalRatings.toLocaleString()} reviews)` : '';
  const price = typeof suggestion.priceLevel === 'number' ? '$'.repeat(Math.max(0, Math.min(4, suggestion.priceLevel + 1))) : undefined;
  const status = suggestion.openNow === true ? 'Open now' : suggestion.openNow === false ? 'Currently closed' : undefined;

<<<<<<< HEAD
  const handleActivate = () => {
    onAdd?.(suggestion);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onAdd?.(suggestion);
    }
  };

  return (
    <li
      className="advisor__item"
      tabIndex={0}
      role={onAdd ? 'button' : undefined}
      aria-label={`${suggestion.name}. ${HINT_LOOKUP[intent]}`}
      onClick={onAdd ? handleActivate : undefined}
      onKeyDown={onAdd ? handleKeyDown : undefined}
=======
  const interactive = Boolean(onAdd);

  return (
    <li
      className={['advisor__item', interactive ? 'advisor__item--interactive' : ''].filter(Boolean).join(' ')}
      tabIndex={interactive ? -1 : 0}
      aria-label={`${suggestion.name}. ${HINT_LOOKUP[intent]}`}
>>>>>>> polyline
    >
      <span className="advisor__item-name">{suggestion.name}</span>
      <div className="advisor__tooltip" role="note">
        <strong>{suggestion.name}</strong>
        <span className="advisor__tooltip-rating">
          {rating} {total}
        </span>
        {price ? <span className="advisor__tooltip-price">Price level: {price}</span> : null}
        {suggestion.address ? <span className="advisor__tooltip-address">{suggestion.address}</span> : null}
        {status ? <span className="advisor__tooltip-status">{status}</span> : null}
        <span>{HINT_LOOKUP[intent]}</span>
      </div>
      {interactive ? (
        <div className="advisor__item-actions">
          <button
            type="button"
            className="advisor__add-button"
            onClick={() => {
              void onAdd?.(suggestion);
            }}
            disabled={disabled}
          >
            {disabled ? 'Adding…' : 'Add to plan'}
          </button>
        </div>
      ) : null}
    </li>
  );
}
