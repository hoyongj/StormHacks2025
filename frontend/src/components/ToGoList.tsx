import type { PlanStop, TravelPlan } from '../App';
import './ToGoList.css';


type ToGoListProps = {
  plan: TravelPlan | null;
  isLoading?: boolean;
  onSelectStop?: (stop: PlanStop, index: number) => void;
  selectedStopIndex?: number | null;
  onAddStop?: () => void;
  onUpdateStop?: (index: number, updates: Partial<PlanStop>) => void;
  onRemoveStop?: (index: number) => void;
};

function ToGoList({
  plan,
  isLoading = false,
  onSelectStop,
  selectedStopIndex = null,
  onAddStop,
  onUpdateStop,
  onRemoveStop,
}: ToGoListProps) {
  const stops = plan?.stops ?? [];
  const hasPlan = Boolean(plan);

  const handleLabelChange = (index: number, value: string) => {
    onUpdateStop?.(index, { label: value });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const sanitized = value.length ? value : '';
    onUpdateStop?.(index, { description: sanitized });
  };

  const handlePlaceIdChange = (index: number, value: string) => {
    onUpdateStop?.(index, { placeId: value.trim() || undefined });
  };

  const handleCoordinateChange = (index: number, key: 'latitude' | 'longitude', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      onUpdateStop?.(index, { [key]: undefined } as Partial<PlanStop>);
      return;
    }

    const numeric = Number(trimmed);
    if (Number.isNaN(numeric)) {
      return;
    }

    onUpdateStop?.(index, { [key]: numeric } as Partial<PlanStop>);
  };

  return (
    <section className="to-go">
      <header className="to-go__header">
        <div className="to-go__header-row">
          <div>
            <p className="to-go__eyebrow">To Go</p>
            <h3>{plan ? 'Upcoming stops' : 'Pick a plan to see your route'}</h3>
          </div>
          <div className="to-go__header-actions">
            <button type="button" className="to-go__button" disabled={!hasPlan}>
              Save
            </button>
            <button
              type="button"
              className="to-go__button to-go__button--secondary"
              onClick={() => (hasPlan ? onAddStop?.() : null)}
              disabled={!hasPlan}
            >
              Add Stop
            </button>
          </div>
        </div>
      </header>

      <ol className="to-go__list">
        {isLoading ? (
          <li className="to-go__empty">Loading your stops…</li>
        ) : stops.length ? (
          stops.map((stop, index) => {
            const isSelected = selectedStopIndex === index;
            return (
              <li
                key={`${stop.label}-${index}`}
                className={isSelected ? 'to-go__item to-go__item--selected' : 'to-go__item'}
              >
                <div className="to-go__item-header">
                  <button type="button" className="to-go__item-select" onClick={() => onSelectStop?.(stop, index)}>
                    <span className="to-go__step">{index + 1}</span>
                    <div>
                      <span className="to-go__title">{stop.label || 'Untitled stop'}</span>
                      {stop.description ? (
                        <span className="to-go__desc">{stop.description}</span>
                      ) : null}
                    </div>
                  </button>
                  <div className="to-go__item-actions">
                    <button
                      type="button"
                      className="to-go__action to-go__action--danger"
                      onClick={() => onRemoveStop?.(index)}
                      disabled={!onRemoveStop}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="to-go__item-editor">
                  <label className="to-go__field">
                    <span>Stop name</span>
                    <input
                      type="text"
                      value={stop.label}
                      onChange={(event) => handleLabelChange(index, event.target.value)}
                      placeholder="Enter stop name"
                    />
                  </label>

                  <label className="to-go__field">
                    <span>Notes</span>
                    <textarea
                      value={stop.description ?? ''}
                      onChange={(event) => handleDescriptionChange(index, event.target.value)}
                      placeholder="Add optional notes"
                      rows={2}
                    />
                  </label>

                  <label className="to-go__field">
                    <span>Place ID (optional)</span>
                    <input
                      type="text"
                      value={stop.placeId ?? ''}
                      onChange={(event) => handlePlaceIdChange(index, event.target.value)}
                      placeholder="ChIJ..."
                    />
                  </label>

                  <div className="to-go__field-grid">
                    <label className="to-go__field to-go__field--compact">
                      <span>Latitude</span>
                      <input
                        type="number"
                        step="any"
                        value={stop.latitude ?? ''}
                        onChange={(event) => handleCoordinateChange(index, 'latitude', event.target.value)}
                        placeholder="49.2827"
                      />
                    </label>
                    <label className="to-go__field to-go__field--compact">
                      <span>Longitude</span>
                      <input
                        type="number"
                        step="any"
                        value={stop.longitude ?? ''}
                        onChange={(event) => handleCoordinateChange(index, 'longitude', event.target.value)}
                        placeholder="-123.1207"
                      />
                    </label>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="to-go__empty">
            <p>No stops yet. Start building your itinerary.</p>
            <button
              type="button"
              className="to-go__button to-go__button--secondary"
              onClick={() => (hasPlan ? onAddStop?.() : null)}
              disabled={!hasPlan}
            >
              Add the first stop
            </button>
          </li>
        )}
      </ol>
    </section>
  );
}

export default ToGoList;
