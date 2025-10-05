import { useEffect, useState } from 'react';
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
  const [expandedStops, setExpandedStops] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setExpandedStops({});
  }, [plan?.id]);

  const toggleStopDetails = (index: number) => {
    setExpandedStops((prev) => ({ ...prev, [index]: !prev[index] }));
  };

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

  const clampToRange = (value: number, min: number, max: number): number => {
    if (Number.isNaN(value)) {
      return min;
    }
    return Math.min(Math.max(value, min), max);
  };

  const normalizeTimeParts = (days: number, hours: number, minutes: number) => {
    const clampedDays = clampToRange(Math.floor(days), 0, 365);
    const clampedHours = clampToRange(Math.floor(hours), 0, 23);
    const clampedMinutes = clampToRange(Math.floor(minutes), 0, 59);
    return {
      timeToSpendDays: clampedDays,
      timeToSpendHours: clampedHours,
      timeToSpendMinutes: clampedMinutes,
    };
  };

  const handleTimePieceChange = (
    index: number,
    field: 'timeToSpendDays' | 'timeToSpendHours' | 'timeToSpendMinutes',
    rawValue: string,
  ) => {
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }

    const stop = stops[index];
    if (!stop) {
      return;
    }

    const parts = normalizeTimeParts(
      field === 'timeToSpendDays' ? parsed : stop.timeToSpendDays ?? 0,
      field === 'timeToSpendHours' ? parsed : stop.timeToSpendHours ?? 0,
      field === 'timeToSpendMinutes' ? parsed : stop.timeToSpendMinutes ?? 0,
    );

    onUpdateStop?.(index, parts);
  };

  const handleTimeClear = (index: number) => {
    onUpdateStop?.(index, {
      timeToSpendDays: undefined,
      timeToSpendHours: undefined,
      timeToSpendMinutes: undefined,
    });
  };

  const handleToggleClick = (index: number) => {
    toggleStopDetails(index);
  };

  const handleRemoveClick = (index: number) => {
    if (!onRemoveStop) {
      return;
    }
    onRemoveStop(index);
    setExpandedStops((prev) => {
      const next: Record<number, boolean> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const currentIndex = Number(key);
        if (currentIndex === index) {
          return;
        }
        const newIndex = currentIndex > index ? currentIndex - 1 : currentIndex;
        if (value) {
          next[newIndex] = true;
        }
      });
      return next;
    });
  };

  const handleSelectStop = (stop: PlanStop, index: number) => {
    onSelectStop?.(stop, index);
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
            const isExpanded = expandedStops[index] ?? false;
            return (
              <li
                key={`${plan?.id ?? 'plan'}-${index}`}
                className={[
                  'to-go__item',
                  isSelected ? 'to-go__item--selected' : '',
                  isExpanded ? 'to-go__item--open' : '',
                ].filter(Boolean).join(' ')}
              >
                <div className="to-go__item-header">
                  <button
                    type="button"
                    className="to-go__item-select"
                    onClick={() => handleSelectStop(stop, index)}
                    aria-pressed={isSelected}
                  >
                    <span className="to-go__step">{index + 1}</span>
                    <div>
                      <span className="to-go__title">{stop.label || 'Untitled stop'}</span>
                    </div>
                  </button>
                  <div className="to-go__item-actions">
                    <button
                      type="button"
                      className="to-go__action to-go__action--toggle"
                      onClick={() => handleToggleClick(index)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Hide details' : 'Show details'}
                    </button>
                    <button
                      type="button"
                      className="to-go__action to-go__action--danger"
                      onClick={() => handleRemoveClick(index)}
                      disabled={!onRemoveStop}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {isExpanded ? (
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
                        <span>Days</span>
                        <input
                          type="number"
                          min="0"
                          value={stop.timeToSpendDays ?? ''}
                          onChange={(event) => handleTimePieceChange(index, 'timeToSpendDays', event.target.value)}
                          placeholder="0"
                        />
                      </label>
                      <label className="to-go__field to-go__field--compact">
                        <span>Hours</span>
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={stop.timeToSpendHours ?? ''}
                          onChange={(event) => handleTimePieceChange(index, 'timeToSpendHours', event.target.value)}
                          placeholder="0"
                        />
                      </label>
                      <label className="to-go__field to-go__field--compact">
                        <span>Minutes</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={stop.timeToSpendMinutes ?? ''}
                          onChange={(event) => handleTimePieceChange(index, 'timeToSpendMinutes', event.target.value)}
                          placeholder="0"
                        />
                      </label>
                      <button
                        type="button"
                        className="to-go__action to-go__action--ghost"
                        onClick={() => handleTimeClear(index)}
                      >
                        Clear time
                      </button>
                    </div>
                    <div className="to-go__field-grid to-go__field-grid--coordinates">
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
                ) : null}
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
