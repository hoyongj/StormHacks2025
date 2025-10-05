import { useEffect, useMemo, useRef, useState } from 'react';
import type { PlanStop, TravelPlan } from '../App';
import './ToGoList.css';

type ToGoListProps = {
  plan: TravelPlan | null;
  draftStops?: PlanStop[] | null;
  isLoading?: boolean;
  onSelectStop?: (stop: PlanStop, index: number) => void;
  selectedStopIndex?: number | null;
  onAddStop?: () => void;
  onUpdateStop?: (index: number, updates: Partial<PlanStop>) => void;
  onRemoveStop?: (index: number) => void;
  onSave?: () => void;
  hasPendingChanges?: boolean;
};

const clampToRange = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
};

const normaliseTimeParts = (days: number, hours: number, minutes: number) => ({
  timeToSpendDays: clampToRange(Math.floor(days), 0, 365),
  timeToSpendHours: clampToRange(Math.floor(hours), 0, 23),
  timeToSpendMinutes: clampToRange(Math.floor(minutes), 0, 59),
});

const durationLabel = (stop: PlanStop): string | null => {
  const tokens: string[] = [];
  if (typeof stop.timeToSpendDays === 'number' && stop.timeToSpendDays > 0) {
    tokens.push(`${stop.timeToSpendDays}d`);
  }
  if (typeof stop.timeToSpendHours === 'number' && stop.timeToSpendHours > 0) {
    tokens.push(`${stop.timeToSpendHours}h`);
  }
  if (typeof stop.timeToSpendMinutes === 'number' && stop.timeToSpendMinutes > 0) {
    tokens.push(`${stop.timeToSpendMinutes}m`);
  }
  if (!tokens.length) {
    return null;
  }
  return tokens.join(' ');
};

function ToGoList({
  plan,
  draftStops = null,
  isLoading = false,
  onSelectStop,
  selectedStopIndex = null,
  onAddStop,
  onUpdateStop,
  onRemoveStop,
  onSave,
  hasPendingChanges = false,
}: ToGoListProps) {
  const planStops = plan?.stops ?? [];
  const formStops = draftStops ?? planStops;
  const allStopsLength = Math.max(planStops.length, formStops.length);
  const hasPlan = Boolean(plan);
  const isEditable = Boolean(onUpdateStop);
  const [expandedStops, setExpandedStops] = useState<Record<number, boolean>>({});
  const previousCountRef = useRef(formStops.length);

  useEffect(() => {
    setExpandedStops({});
    previousCountRef.current = formStops.length;
  }, [plan?.id]);

  useEffect(() => {
    if (formStops.length > previousCountRef.current) {
      const newIndex = formStops.length - 1;
      setExpandedStops((prev) => ({ ...prev, [newIndex]: true }));
    }
    previousCountRef.current = formStops.length;
  }, [formStops.length, formStops]);

  const durationSummaries = useMemo(() => 
    Array.from({ length: allStopsLength })
      .map((_, index) => {
        const savedStop = planStops[index] ?? null;
        const draftStop = formStops[index] ?? null;
        const displayStop = savedStop ?? draftStop;
        return displayStop ? durationLabel(displayStop) : null;
      }),
    [allStopsLength, planStops, formStops],
  );

  const canSave = Boolean(isEditable && onSave && hasPendingChanges);
  const showUnsavedBadge = Boolean(isEditable && hasPendingChanges);
  const inputsDisabled = !isEditable;

  const toggleStopDetails = (index: number) => {
    setExpandedStops((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLabelChange = (index: number, value: string) => {
    onUpdateStop?.(index, { label: value });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    onUpdateStop?.(index, { description: value.length ? value : '' });
  };

  const handlePlaceIdChange = (index: number, value: string) => {
    const trimmed = value.trim();
    onUpdateStop?.(index, { placeId: trimmed || undefined });
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

  const handleTimePieceChange = (
    index: number,
    field: 'timeToSpendDays' | 'timeToSpendHours' | 'timeToSpendMinutes',
    rawValue: string,
  ) => {
    if (!isEditable) {
      return;
    }
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }

    const stop = formStops[index];
    if (!stop) {
      return;
    }

    const nextValues = normaliseTimeParts(
      field === 'timeToSpendDays' ? parsed : stop.timeToSpendDays ?? 0,
      field === 'timeToSpendHours' ? parsed : stop.timeToSpendHours ?? 0,
      field === 'timeToSpendMinutes' ? parsed : stop.timeToSpendMinutes ?? 0,
    );

    onUpdateStop?.(index, nextValues);
  };

  const handleTimeClear = (index: number) => {
    if (!isEditable) {
      return;
    }
    onUpdateStop?.(index, {
      timeToSpendDays: undefined,
      timeToSpendHours: undefined,
      timeToSpendMinutes: undefined,
    });
  };

  const handleSaveClick = () => {
    if (!canSave) {
      return;
    }
    onSave?.();
  };

  const handleAddStopClick = () => {
    if (!isEditable || !onAddStop) {
      return;
    }
    onAddStop();
  };

  const handleRemoveStopClick = (index: number) => {
    if (!isEditable || !onRemoveStop) {
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

  const handleSelectStopClick = (stop: PlanStop, index: number) => {
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
            {showUnsavedBadge ? <span className="to-go__draft-indicator">Unsaved changes</span> : null}
            <button
              type="button"
              className="to-go__button"
              onClick={handleSaveClick}
              disabled={!canSave}
            >
              Save
            </button>
            <button
              type="button"
              className="to-go__button to-go__button--secondary"
              onClick={handleAddStopClick}
              disabled={!isEditable}
            >
              Add Stop
            </button>
          </div>
        </div>
      </header>

      <ol className="to-go__list">
        {isLoading ? (
          <li className="to-go__empty">Loading your stops…</li>
        ) : allStopsLength ? (
          Array.from({ length: allStopsLength }).map((_, index) => {
            const savedStop = planStops[index] ?? null;
            const draftStop = formStops[index] ?? null;
            if (!savedStop && !draftStop) {
              return null;
            }
            const displayStop = savedStop ?? draftStop!;
            const editableStop = draftStop ?? savedStop!;
            const isSelected = selectedStopIndex === index;
            const isExpanded = expandedStops[index] ?? false;
            const summary = durationSummaries[index];
            const isNew = !savedStop && Boolean(draftStop);
            const isRemoved = Boolean(savedStop && !draftStop);
            const detailInputsDisabled = inputsDisabled || isRemoved;

            return (
              <li
                key={`${plan?.id ?? 'plan'}-${index}`}
                className={[
                  'to-go__item',
                  isSelected ? 'to-go__item--selected' : '',
                  isExpanded ? 'to-go__item--open' : '',
                  isNew ? 'to-go__item--draft-new' : '',
                  isRemoved ? 'to-go__item--draft-removed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="to-go__item-header">
                  <button
                    type="button"
                    className="to-go__item-select"
                    onClick={() => handleSelectStopClick(editableStop, index)}
                    aria-pressed={isSelected}
                  >
                    <span className="to-go__step">{index + 1}</span>
                    <div className="to-go__item-text">
                      <span className="to-go__title">{displayStop.label || 'Untitled stop'}</span>
                      {summary ? <span className="to-go__time-pill">{summary}</span> : null}
                      {isNew ? <span className="to-go__chip to-go__chip--new">New</span> : null}
                      {isRemoved ? <span className="to-go__chip to-go__chip--removed">Removed</span> : null}
                    </div>
                  </button>
                  <div className="to-go__item-actions">
                    <button
                      type="button"
                      className="to-go__action to-go__action--toggle"
                      onClick={() => toggleStopDetails(index)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Hide details' : 'Show details'}
                    </button>
                    <button
                      type="button"
                      className="to-go__action to-go__action--danger"
                      onClick={() => handleRemoveStopClick(index)}
                      disabled={!isEditable || !onRemoveStop}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className={isExpanded ? 'to-go__item-details to-go__item-details--open' : 'to-go__item-details'}>
                  <label className="to-go__field">
                    <span>Stop name</span>
                    <input
                      type="text"
                      value={editableStop.label}
                      onChange={(event) => handleLabelChange(index, event.target.value)}
                      placeholder="Enter stop name"
                      disabled={detailInputsDisabled}
                    />
                  </label>

                  <label className="to-go__field">
                    <span>Notes</span>
                    <textarea
                      value={editableStop.description ?? ''}
                      onChange={(event) => handleDescriptionChange(index, event.target.value)}
                      placeholder="Add optional notes"
                      rows={2}
                      disabled={detailInputsDisabled}
                    />
                  </label>

                  <label className="to-go__field">
                    <span>Place ID (optional)</span>
                    <input
                      type="text"
                      value={editableStop.placeId ?? ''}
                      onChange={(event) => handlePlaceIdChange(index, event.target.value)}
                      placeholder="ChIJ..."
                      disabled={detailInputsDisabled}
                    />
                  </label>

                  <div className="to-go__field-grid">
                    <label className="to-go__field to-go__field--compact">
                      <span>Days</span>
                      <input
                        type="number"
                        min="0"
                        value={editableStop.timeToSpendDays ?? ''}
                        onChange={(event) => handleTimePieceChange(index, 'timeToSpendDays', event.target.value)}
                        placeholder="0"
                        disabled={detailInputsDisabled}
                      />
                    </label>
                    <label className="to-go__field to-go__field--compact">
                      <span>Hours</span>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={editableStop.timeToSpendHours ?? ''}
                        onChange={(event) => handleTimePieceChange(index, 'timeToSpendHours', event.target.value)}
                        placeholder="0"
                        disabled={detailInputsDisabled}
                      />
                    </label>
                    <label className="to-go__field to-go__field--compact">
                      <span>Minutes</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={editableStop.timeToSpendMinutes ?? ''}
                        onChange={(event) => handleTimePieceChange(index, 'timeToSpendMinutes', event.target.value)}
                        placeholder="0"
                        disabled={detailInputsDisabled}
                      />
                    </label>
                    <button
                      type="button"
                      className="to-go__action to-go__action--ghost"
                      onClick={() => handleTimeClear(index)}
                      disabled={detailInputsDisabled}
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
                        value={editableStop.latitude ?? ''}
                        onChange={(event) => handleCoordinateChange(index, 'latitude', event.target.value)}
                        placeholder="49.2827"
                        disabled={detailInputsDisabled}
                      />
                    </label>
                    <label className="to-go__field to-go__field--compact">
                      <span>Longitude</span>
                      <input
                        type="number"
                        step="any"
                        value={editableStop.longitude ?? ''}
                        onChange={(event) => handleCoordinateChange(index, 'longitude', event.target.value)}
                        placeholder="-123.1207"
                        disabled={detailInputsDisabled}
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
              onClick={handleAddStopClick}
              disabled={!isEditable}
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
