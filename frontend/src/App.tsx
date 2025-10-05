import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import TripAdvisor from './components/TripAdvisor';
import AiAssistantPanel from './components/AiAssistantPanel';
import ToGoList from './components/ToGoList';
import PlanManager from './components/PlanManager';
import AdminPanel from './components/AdminPanel';
import './App.css';

export type PlanStop = {
  label: string;
  description?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  timeToSpendDays?: number;
  timeToSpendHours?: number;
  timeToSpendMinutes?: number;
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
  description?: string | null;
  placeId?: string | null;
  place_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timeToSpendDays?: number | null;
  timeToSpendHours?: number | null;
  timeToSpendMinutes?: number | null;
};

export type TripAdvisorSuggestion = {
  name: string;
  rating?: number;
  totalRatings?: number;
  address?: string;
  priceLevel?: number;
  openNow?: boolean;
  types: string[];
};

export type TripAdvisorInfo = {
  id: string;
  name: string;
  city?: string;
  country?: string;
  address?: string;
  summary?: string;
  nearbyRestaurants: TripAdvisorSuggestion[];
  nearbyHotels: TripAdvisorSuggestion[];
  nearbyAttractions: TripAdvisorSuggestion[];
  latitude?: number;
  longitude?: number;
};

export type RouteSegment = {
  fromIndex: number;
  toIndex: number;
  mode: string;
  durationText?: string;
  distanceText?: string;
  instructions?: string;
  agency?: string;
  lineName?: string;
};

export type Folder = {
  id: string;
  name: string;
  planIds: string[];
};

export type UserProfile = {
  name: string;
  email: string;
  homeCity: string;
  bio?: string;
};

type MapRouteResponse = {
  plan_id: string;
  polyline: string;
  warnings: string[];
  segments: RouteSegmentResponse[];
};

type RouteSegmentResponse = {
  from_index: number;
  to_index: number;
  mode: string;
  duration_text?: string;
  distance_text?: string;
  instructions?: string;
  agency?: string;
  line_name?: string;
};

type TripAdvisorResponsePayload = {
  info: {
    id: string;
    name: string;
    city?: string;
    country?: string;
    address?: string;
    summary?: string;
    nearby_restaurants: TripAdvisorSuggestionPayload[];
    nearby_hotels: TripAdvisorSuggestionPayload[];
    nearby_attractions: TripAdvisorSuggestionPayload[];
    coordinates: { latitude: number; longitude: number };
  };
};

type TripAdvisorSuggestionPayload = {
  name: string;
  rating?: number;
  total_ratings?: number;
  address?: string;
  price_level?: number;
  open_now?: boolean;
  types?: string[];
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
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [view, setView] = useState<'planner' | 'manager' | 'admin'>('planner');
  const [folders, setFolders] = useState<Folder[]>([{ id: 'all', name: 'All Plans', planIds: [] }]);
  const [libraryFolderId, setLibraryFolderId] = useState('all');
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jamie Hoang',
    email: 'jamie.hoang@example.com',
    homeCity: 'Vancouver, BC',
    bio: 'Train-hopping foodie who loves scenic detours.'
  });

  useEffect(() => {
    if (!folders.some((folder) => folder.id === libraryFolderId)) {
      setLibraryFolderId('all');
    }
  }, [folders, libraryFolderId]);

  const [draftPlan, setDraftPlan] = useState<TravelPlan | null>(null);
  const [isDraftDirty, setIsDraftDirty] = useState(false);
  const latestAdvisorRequest = useRef(0);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );
  const workingPlan = draftPlan ?? selectedPlan;
  const workingPlanStops = useMemo(() => workingPlan?.stops ?? [], [workingPlan]);

  const selectedStop = useMemo(() => {
    if (!workingPlan || !selectedStopRef) {
      return null;
    }
    if (selectedStopRef.planId !== workingPlan.id) {
      return null;
    }
    return workingPlanStops[selectedStopRef.index] ?? null;
  }, [workingPlan, workingPlanStops, selectedStopRef]);

  const selectedStopIndex = useMemo(() => {
    if (!workingPlan || !selectedStopRef) {
      return null;
    }
    return selectedStopRef.planId === workingPlan.id ? selectedStopRef.index : null;
  }, [workingPlan, selectedStopRef]);

  useEffect(() => {
    if (!selectedPlan) {
      if (draftPlan !== null) {
        setDraftPlan(null);
      }
      setIsDraftDirty(false);
      return;
    }

    if (draftPlan && draftPlan.id === selectedPlan.id) {
      const metadataChanged =
        draftPlan.title !== selectedPlan.title ||
        draftPlan.summary !== selectedPlan.summary ||
        draftPlan.createdAt !== selectedPlan.createdAt;

      if (isDraftDirty) {
        if (metadataChanged) {
          setDraftPlan({
            ...draftPlan,
            title: selectedPlan.title,
            summary: selectedPlan.summary,
            createdAt: selectedPlan.createdAt,
          });
        }
        return;
      }

      if (metadataChanged || draftPlan.stops.length !== selectedPlan.stops.length) {
        setDraftPlan(clonePlan(selectedPlan));
      }
      return;
    }

    setDraftPlan(clonePlan(selectedPlan));
    setIsDraftDirty(false);
  }, [selectedPlan, draftPlan, isDraftDirty]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (view !== 'planner') {
      setShowModal(false);
    }
  }, [view]);

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
        setRouteSegments([]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error loading plans.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlans();
  }, []);

  useEffect(() => {
    setFolders((prev) => {
      const planIds = plans.map((plan) => plan.id);
      const validIds = new Set(planIds);

      const byId = new Map<string, Folder>();
      prev.forEach((folder) => {
        byId.set(folder.id, {
          ...folder,
          planIds:
            folder.id === 'all'
              ? planIds
              : folder.planIds.filter((id) => validIds.has(id)),
        });
      });

      if (!byId.has('all')) {
        byId.set('all', { id: 'all', name: 'All Plans', planIds });
      } else {
        byId.set('all', { id: 'all', name: 'All Plans', planIds });
      }

      const next = Array.from(byId.values());
      next.sort((a, b) => {
        if (a.id === 'all') return -1;
        if (b.id === 'all') return 1;
        return a.name.localeCompare(b.name);
      });
      return next;
    });
  }, [plans]);

  useEffect(() => {
    if (view !== 'planner' || !selectedPlan || selectedPlan.stops.length < 2) {
      setRouteSegments([]);
      return;
    }

    let cancelled = false;
    const currentPlanId = selectedPlan.id;

    async function loadRoute() {
      try {
        const response = await fetch(`${API_BASE_URL}/plan/${currentPlanId}/route`);
        if (!response.ok) {
          throw new Error('Failed to load route details');
        }
        const payload: MapRouteResponse = await response.json();
        const segments = (payload.segments ?? []).map(normalizeRouteSegment);
        if (!cancelled) {
          setRouteSegments(segments);
        }
      } catch (err) {
        if (!cancelled) {
          setRouteSegments([]);
        }
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [selectedPlan, selectedPlanId, view]);

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

  const handleDraftAddStop = () => {
    setDraftPlan((prev) => {
      if (!prev) {
        return prev;
      }
      setIsDraftDirty(true);
      const nextIndex = prev.stops.length + 1;
      const newStop: PlanStop = {
        label: `New Stop ${nextIndex}`,
        description: '',
      };
      return { ...prev, stops: [...prev.stops, newStop] };
    });
    setRouteSegments([]);
  };

  const handleDraftUpdateStop = (stopIndex: number, updates: Partial<PlanStop>) => {
    setDraftPlan((prev) => {
      if (!prev) {
        return prev;
      }
      setIsDraftDirty(true);
      const stops = prev.stops.map((stop, index) => (index === stopIndex ? { ...stop, ...updates } : stop));
      return { ...prev, stops };
    });
    setRouteSegments([]);
  };

  const handleDraftRemoveStop = (stopIndex: number) => {
    if (!draftPlan) {
      return;
    }
    const planId = draftPlan.id;
    setDraftPlan((prev) => {
      if (!prev) {
        return prev;
      }
      setIsDraftDirty(true);
      const stops = prev.stops.filter((_, index) => index !== stopIndex);
      return { ...prev, stops };
    });
    setSelectedStopRef((current) => {
      if (!current || current.planId !== planId) {
        return current;
      }
      if (current.index === stopIndex) {
        return null;
      }
      if (current.index > stopIndex) {
        return { planId, index: current.index - 1 };
      }
      return current;
    });
  };

  const handleDraftSave = async () => {
    if (!draftPlan) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/plan/${draftPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializePlanForSave(draftPlan)),
      });

      if (!response.ok) {
        throw new Error('Failed to save plan');
      }

      const payload: TravelPlanResponse = await response.json();
      const savedPlan = normalizePlan(payload);

      setPlans((prev) => {
        const index = prev.findIndex((plan) => plan.id === savedPlan.id);
        if (index === -1) {
          return [savedPlan, ...prev];
        }
        const next = [...prev];
        next[index] = savedPlan;
        return next;
      });
      setRouteSegments([]);
      setAdvisorInfo(null);
      setAdvisorError(null);
      setDraftPlan(clonePlan(savedPlan));
      setIsDraftDirty(false);
      setError(null);
    } catch (err) {
      console.error('Failed to save plan updates', err);
      setError('Unable to save plan changes. Please try again.');
    }
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
    setDraftPlan(clonePlan(newPlan));
    setIsDraftDirty(false);
  };

  const handleCreateFolder = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) {
      return null;
    }
    const id = `folder-${createClientGeneratedId()}`;
    let created = false;
    setFolders((prev) => {
      if (prev.some((folder) => folder.name.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      created = true;
      return [...prev, { id, name: trimmed, planIds: [] }];
    });
    if (created) {
      setLibraryFolderId(id);
      return id;
    }
    return null;
  };

  const handleAssignPlanToFolder = (folderId: string, planId: string) => {
    if (folderId === 'all') {
      return;
    }
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              planIds: folder.planIds.includes(planId)
                ? folder.planIds
                : [...folder.planIds, planId],
            }
          : folder,
      ),
    );
  };

  const handleRemovePlanFromFolder = (folderId: string, planId: string) => {
    if (folderId === 'all') {
      return;
    }
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, planIds: folder.planIds.filter((id) => id !== planId) }
          : folder,
      ),
    );
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
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
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === 'all'
          ? folder
          : { ...folder, planIds: folder.planIds.filter((id) => id !== planId) },
      ),
    );
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

  const handleStopSelected = (stop: PlanStop, stopIndex: number) => {
    if (!workingPlan) {
      return;
    }

    startTransition(() => {
      setSelectedStopRef({ planId: workingPlan.id, index: stopIndex });
    });

    const requestId = ++latestAdvisorRequest.current;
    setAdvisorLoading(true);
    setAdvisorError(null);

    const payload = {
      name: stop.label,
      description: stop.description,
      latitude: stop.latitude,
      longitude: stop.longitude,
      place_id: stop.placeId,
    };

    void (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tripadvisor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Unable to fetch place details.');
        }
        const payloadData: TripAdvisorResponsePayload = await response.json();
        if (latestAdvisorRequest.current === requestId) {
          setAdvisorInfo(normalizeTripAdvisorInfo(payloadData.info));
          setAdvisorError(null);
        }
      } catch (err) {
        if (latestAdvisorRequest.current === requestId) {
          setAdvisorError(err instanceof Error ? err.message : 'Unexpected error loading place details.');
          setAdvisorInfo(null);
        }
      } finally {
        if (latestAdvisorRequest.current === requestId) {
          setAdvisorLoading(false);
        }
      }
    })();
  };

  useEffect(() => {
    latestAdvisorRequest.current += 1;
    setAdvisorInfo(null);
    setAdvisorError(null);
    setAdvisorLoading(false);
    setSelectedStopRef(null);
    setRouteSegments([]);
  }, [selectedPlanId]);

  return (
    <div className="app">
      <header className="app__header">
        <button type="button" className="app__logo" onClick={() => setView('planner')}>
          Pathfinder
        </button>
        <div className="app__header-actions">
          {view !== 'planner' ? (
            <button
              type="button"
              className="app__nav-button"
              onClick={() => setView('planner')}
            >
              Back to Planner
            </button>
          ) : (
            <button
              type="button"
              className="app__nav-button"
              onClick={() => setView('manager')}
            >
              Manage Plans
            </button>
          )}
          {view === 'planner' ? (
            <button
              type="button"
              className="info__create"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              Create New Plan
            </button>
          ) : null}
          <button
            type="button"
            className={view === 'admin' ? 'app__profile-button app__profile-button--active' : 'app__profile-button'}
            onClick={() => setView('admin')}
            aria-label="Open profile settings"
          >
            <span className="app__profile-icon" aria-hidden>
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 19c0-3.3137 3.134-6 7-6h2c3.866 0 7 2.6863 7 6v1H4v-1z" />
              </svg>
            </span>
          </button>
        </div>
      </header>

      {view === 'planner' && showModal && (
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

      {view === 'planner' ? (
        <div className="app__layout">
          <aside className="app__summary">
            <InfoPanel
              plan={selectedPlan}
              plans={plans}
              folders={folders}
              selectedFolderId={libraryFolderId}
              onSelectFolder={setLibraryFolderId}
              selectedPlanId={selectedPlanId}
              onSelectPlan={setSelectedPlanId}
              onUpdatePlanTitle={handlePlanTitleChange}
              onUpdatePlanSummary={handlePlanSummaryChange}
              onDeletePlan={handleDeletePlan}
              routeSegments={routeSegments}
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
                  draftStops={draftPlan?.stops ?? null}
                  isLoading={isLoading}
                  onSelectStop={handleStopSelected}
                  selectedStopIndex={selectedStopIndex}
                  onAddStop={draftPlan ? handleDraftAddStop : undefined}
                  onUpdateStop={draftPlan ? handleDraftUpdateStop : undefined}
                  onRemoveStop={draftPlan ? handleDraftRemoveStop : undefined}
                  onSave={draftPlan ? handleDraftSave : undefined}
                  hasPendingChanges={isDraftDirty}
                />
              </div>
            </div>
            <TripAdvisor
              selectedStop={selectedStop}
              info={advisorInfo}
              isLoading={advisorLoading}
              error={advisorError}
              stops={selectedPlan?.stops ?? []}
            />
          </section>

          <aside className="app__assistant">
            <AiAssistantPanel />
          </aside>
        </div>
      ) : view === 'manager' ? (
        <PlanManager
          plans={plans}
          folders={folders}
          onCreateFolder={handleCreateFolder}
          onAssignPlan={handleAssignPlanToFolder}
          onRemovePlan={handleRemovePlanFromFolder}
        />
      ) : (
        <AdminPanel profile={profile} onUpdateProfile={handleUpdateProfile} />
      )}
    </div>
  );
}

function serializePlanForSave(plan: TravelPlan) {
  return {
    id: plan.id,
    title: plan.title,
    summary: plan.summary,
    createdAt: plan.createdAt,
    stops: plan.stops.map(serializeStopForSave),
  };
}

function serializeStopForSave(stop: PlanStop) {
  return {
    label: stop.label,
    description: stop.description ?? '',
    place_id: stop.placeId ?? null,
    latitude: typeof stop.latitude === 'number' ? stop.latitude : null,
    longitude: typeof stop.longitude === 'number' ? stop.longitude : null,
  };
}

function clonePlan(plan: TravelPlan): TravelPlan {
  return {
    ...plan,
    stops: plan.stops.map((stop) => ({ ...stop })),
  };
}

function normalizePlan(plan: TravelPlanResponse): TravelPlan {
  return {
    id: plan.id,
    title: plan.title,
    summary: plan.summary,
    createdAt: plan.createdAt,
    stops: plan.stops.map((stop) => ({
      label: stop.label,
      description: stop.description ?? undefined,
      placeId: stop.placeId ?? stop.place_id ?? undefined,
      latitude: typeof stop.latitude === 'number' ? stop.latitude : undefined,
      longitude: typeof stop.longitude === 'number' ? stop.longitude : undefined,
      timeToSpendDays: typeof stop.timeToSpendDays === 'number' ? stop.timeToSpendDays : undefined,
      timeToSpendHours: typeof stop.timeToSpendHours === 'number' ? stop.timeToSpendHours : undefined,
      timeToSpendMinutes: typeof stop.timeToSpendMinutes === 'number' ? stop.timeToSpendMinutes : undefined,
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
    nearbyRestaurants: info.nearby_restaurants.map(normalizeSuggestion),
    nearbyHotels: info.nearby_hotels.map(normalizeSuggestion),
    nearbyAttractions: info.nearby_attractions.map(normalizeSuggestion),
    latitude: info.coordinates?.latitude,
    longitude: info.coordinates?.longitude,
  };
}

function normalizeSuggestion(suggestion: TripAdvisorSuggestionPayload): TripAdvisorSuggestion {
  return {
    name: suggestion.name,
    rating: suggestion.rating,
    totalRatings: suggestion.total_ratings,
    address: suggestion.address,
    priceLevel: suggestion.price_level,
    openNow: suggestion.open_now,
    types: suggestion.types ?? [],
  };
}

function normalizeRouteSegment(segment: RouteSegmentResponse): RouteSegment {
  return {
    fromIndex: segment.from_index,
    toIndex: segment.to_index,
    mode: segment.mode,
    durationText: segment.duration_text,
    distanceText: segment.distance_text,
    instructions: segment.instructions,
    agency: segment.agency,
    lineName: segment.line_name,
  };
}

export default App;
