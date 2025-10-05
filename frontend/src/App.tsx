import { useEffect, useMemo, useState } from 'react';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import TripAdvisor from './components/TripAdvisor';
import AiAssistantPanel from './components/AiAssistantPanel';
import ToGoList from './components/ToGoList';
import './App.css';

export type PlanStop = {
  label: string;
  description?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
};

export type TravelPlan = {
  id: string;
  title: string;
  summary: string;
  stops: PlanStop[];
  createdAt: string;
};

type PlansResponse = {
  options: TravelPlanResponse[];
};

type TravelPlanResponse = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  stops: PlanStopResponse[];
};

type PlanStopResponse = {
  label: string;
  description?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
};

export type TripAdvisorInfo = {
  id: string;
  name: string;
  city?: string;
  country?: string;
  address?: string;
  summary?: string;
  nearbyRestaurants: string[];
  nearbyHotels: string[];
  nearbyAttractions: string[];
  latitude?: number;
  longitude?: number;
};

type TripAdvisorResponsePayload = {
  info: {
    id: string;
    name: string;
    city?: string;
    country?: string;
    address?: string;
    summary?: string;
    nearby_restaurants: string[];
    nearby_hotels: string[];
    nearby_attractions: string[];
    coordinates: { latitude: number; longitude: number };
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

function App() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [advisorInfo, setAdvisorInfo] = useState<TripAdvisorInfo | null>(null);
  const [advisorError, setAdvisorError] = useState<string | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState<boolean>(false);
  const [selectedStopRef, setSelectedStopRef] = useState<{ planId: string; index: number } | null>(null);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const selectedPlanStops = useMemo(() => selectedPlan?.stops ?? [], [selectedPlan]);

  const selectedStop = useMemo(() => {
    if (!selectedPlan || !selectedStopRef) {
      return null;
    }
    if (selectedStopRef.planId !== selectedPlan.id) {
      return null;
    }
    return selectedPlanStops[selectedStopRef.index] ?? null;
  }, [selectedPlan, selectedPlanStops, selectedStopRef]);

  const selectedStopIndex = useMemo(() => {
    if (!selectedPlan || !selectedStopRef) {
      return null;
    }
    return selectedStopRef.planId === selectedPlan.id ? selectedStopRef.index : null;
  }, [selectedPlan, selectedStopRef]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch(`${API_BASE_URL}/plans`);
        if (!response.ok) {
          throw new Error('Unable to load travel plans');
        }
        const payload: PlansResponse = await response.json();
        const normalized = payload.options.map(normalizePlan);
        setPlans(normalized);
        setSelectedPlanId((prev) => (prev ? prev : normalized[0]?.id ?? ''));
        setSelectedStopRef(null);
        setAdvisorInfo(null);
        setAdvisorError(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error loading plans.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlans();
  }, []);

  const [planName, setPlanName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [startPlace, setStartPlace] = useState('');
  const [endPlace, setEndPlace] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [motivation, setMotivation] = useState<string[]>([]);
  const [modalTouched, setModalTouched] = useState(false);

  const TRIP_MOTIVATIONS = [
    'Food',
    'Museums',
    'Music',
    'Architecture',
    'Nature',
    'Shopping',
    'Nightlife',
    'Scenery',
    'Relaxation',
  ];

  const isModalValid = startPlace.trim() && endPlace.trim() && motivation.length > 0;

  const resetModal = () => {
    setPlanName('');
    setEditingName(false);
    setStartPlace('');
    setEndPlace('');
    setStartDate('');
    setEndDate('');
    setMotivation([]);
    setModalTouched(false);
  };

  const createClientGeneratedId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return 'local-' + crypto.randomUUID();
    }
    return 'local-' + Math.random().toString(36).slice(2, 10);
  };

  const handlePlanTitleChange = (planId: string, title: string) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, title: title || '' } : plan)),
    );
  };

  const handlePlanSummaryChange = (planId: string, summary: string) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, summary: summary || '' } : plan)),
    );
  };

  const handleAddStop = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) {
          return plan;
        }
        const nextIndex = plan.stops.length + 1;
        const newStop: PlanStop = {
          label: `New Stop ${nextIndex}`,
          description: '',
        };
        return { ...plan, stops: [...plan.stops, newStop] };
      }),
    );
  };

  const handleUpdateStop = (planId: string, stopIndex: number, updates: Partial<PlanStop>) => {
    let updatedStop: PlanStop | null = null;
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) {
          return plan;
        }
        const stops = plan.stops.map((stop, index) => {
          if (index !== stopIndex) {
            return stop;
          }
          updatedStop = { ...stop, ...updates };
          return updatedStop;
        });
        return { ...plan, stops };
      }),
    );
    if (
      planId === selectedPlanId &&
      updatedStop &&
      selectedStopRef &&
      selectedStopRef.planId === planId &&
      selectedStopRef.index === stopIndex
    ) {
      setSelectedStopRef({ planId, index: stopIndex });
    }
  };

  const handleRemoveStop = (planId: string, stopIndex: number) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) {
          return plan;
        }
        const stops = plan.stops.filter((_, index) => index !== stopIndex);
        return { ...plan, stops };
      }),
    );

    if (selectedStopRef && selectedStopRef.planId === planId) {
      if (selectedStopRef.index === stopIndex) {
        setSelectedStopRef(null);
        setAdvisorInfo(null);
        setAdvisorError(null);
      } else if (selectedStopRef.index > stopIndex) {
        setSelectedStopRef({ planId, index: selectedStopRef.index - 1 });
      }
    }
  };

  const handleCreateLocalPlan = () => {
    const newPlan: TravelPlan = {
      id: createClientGeneratedId(),
      title: 'Untitled Plan',
      summary: 'Describe this adventure so it stands out in your library.',
      stops: [],
      createdAt: new Date().toISOString(),
    };
    setPlans((prev) => [newPlan, ...prev]);
    setSelectedPlanId(newPlan.id);
    setSelectedStopRef(null);
    setAdvisorInfo(null);
    setAdvisorError(null);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans((prev) => {
      const updated = prev.filter((plan) => plan.id !== planId);
      if (selectedPlanId === planId) {
        const fallback = updated[0]?.id ?? '';
        setSelectedPlanId(fallback);
        setSelectedStopRef(null);
        setAdvisorInfo(null);
        setAdvisorError(null);
      }
      return updated;
    });
  };

  const handleModalSave = async () => {
    setModalTouched(true);
    if (!isModalValid) return;
    setShowModal(false);
    resetModal();
    // For now, just call the old handleCreateNew logic
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Plan a day exploring Burnaby around SFU.' }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate a new plan');
      }
      const planResponse: TravelPlanResponse = await response.json();
      const plan = normalizePlan(planResponse);
      setPlans((prev) => [plan, ...prev]);
      setSelectedPlanId(plan.id);
      setSelectedStopRef(null);
      setAdvisorInfo(null);
      setAdvisorError(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error creating a plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSelected = async (stop: PlanStop, stopIndex: number) => {
    if (!selectedPlan) {
      return;
    }
    setSelectedStopRef({ planId: selectedPlan.id, index: stopIndex });
    setAdvisorLoading(true);
    setAdvisorError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tripadvisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: stop.label,
          description: stop.description,
          latitude: stop.latitude,
          longitude: stop.longitude,
          place_id: stop.placeId,
        }),
      });
      if (!response.ok) {
        throw new Error('Unable to fetch place details.');
      }
      const payload: TripAdvisorResponsePayload = await response.json();
      setAdvisorInfo(normalizeTripAdvisorInfo(payload.info));
    } catch (err) {
      setAdvisorError(err instanceof Error ? err.message : 'Unexpected error loading place details.');
      setAdvisorInfo(null);
    } finally {
      setAdvisorLoading(false);
    }
  };

  useEffect(() => {
    setAdvisorInfo(null);
    setAdvisorError(null);
    setSelectedStopRef(null);
  }, [selectedPlanId]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Pathfinder</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            className="info__create"
            onClick={() => setShowModal(true)}
            disabled={isLoading}
          >
            Create New Plan
          </button>
          <div className="app__profile">JH</div>
        </div>
      </header>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__title">
              {editingName ? (
                <input
                  type="text"
                  value={planName}
                  onChange={e => setPlanName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={e => { if (e.key === 'Enter') setEditingName(false); }}
                  autoFocus
                  className="modal__title-input"
                  placeholder="Enter plan name..."
                />
              ) : (
                <span className="modal__title-text" onClick={() => setEditingName(true)}>
                  {planName || 'Untitled Plan'}
                </span>
              )}
            </div>

            <div className="modal__fields">
              <div className="modal__row">
                <label>Start:</label>
                <input
                  type="text"
                  value={startPlace}
                  onChange={e => setStartPlace(e.target.value)}
                  placeholder="Start location..."
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="modal__row">
                <label>End:</label>
                <input
                  type="text"
                  value={endPlace}
                  onChange={e => setEndPlace(e.target.value)}
                  placeholder="End location..."
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="modal__motivation">
              <p>Trip Motivation:</p>
              <div className="modal__motivation-list">
                {TRIP_MOTIVATIONS.map(option => (
                  <button
                    key={option}
                    onClick={() => setMotivation(motivation.includes(option)
                      ? motivation.filter(m => m !== option)
                      : [...motivation, option])}
                    className={`modal__motivation-btn ${motivation.includes(option) ? 'selected' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => { setShowModal(false); resetModal(); }}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleModalSave} disabled={!isModalValid}>
                Save Plan
              </button>
            </div>
            {modalTouched && !isModalValid && (
              <div style={{ color: 'red', marginTop: 8, fontSize: 13 }}>
                Please fill in start, end, and select at least one motivation.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="app__layout">
        <aside className="app__summary">
          <InfoPanel
            plan={selectedPlan}
            plans={plans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
            onUpdatePlanTitle={handlePlanTitleChange}
            onUpdatePlanSummary={handlePlanSummaryChange}
            onCreatePlan={handleCreateLocalPlan}
            onDeletePlan={handleDeletePlan}
          />
        </aside>

        <section className="app__content">
          {error ? <div className="app__error">{error}</div> : null}
          <div className="app__primary">
            <div className="app__map">
              <MapView plan={selectedPlan} />
            </div>
            <div className="app__to-go">
              <ToGoList
                plan={selectedPlan}
                isLoading={isLoading}
                onSelectStop={handleStopSelected}
                selectedStopIndex={selectedStopIndex}
                onAddStop={selectedPlan ? () => handleAddStop(selectedPlan.id) : undefined}
                onUpdateStop={selectedPlan ? (index, updates) => handleUpdateStop(selectedPlan.id, index, updates) : undefined}
                onRemoveStop={selectedPlan ? (index) => handleRemoveStop(selectedPlan.id, index) : undefined}
              />
            </div>
          </div>
          <TripAdvisor
            selectedStop={selectedStop}
            info={advisorInfo}
            isLoading={advisorLoading}
            error={advisorError}
            stops={selectedPlanStops}
          />
        </section>

        <aside className="app__assistant">
          <AiAssistantPanel />
        </aside>
      </div>
    </div>
  );
}

function normalizePlan(plan: TravelPlanResponse): TravelPlan {
  return {
    id: plan.id,
    title: plan.title,
    summary: plan.summary,
    createdAt: plan.createdAt,
    stops: plan.stops.map((stop) => ({
      label: stop.label,
      description: stop.description,
      placeId: stop.placeId,
      latitude: stop.latitude,
      longitude: stop.longitude,
    })),
  };
}

function normalizeTripAdvisorInfo(info: TripAdvisorResponsePayload['info']): TripAdvisorInfo {
  return {
    id: info.id,
    name: info.name,
    city: info.city,
    country: info.country,
    address: info.address,
    summary: info.summary,
    nearbyRestaurants: info.nearby_restaurants,
    nearbyHotels: info.nearby_hotels,
    nearbyAttractions: info.nearby_attractions,
    latitude: info.coordinates?.latitude,
    longitude: info.coordinates?.longitude,
  };
}

export default App;
