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
  const [selectedStop, setSelectedStop] = useState<PlanStop | null>(null);

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
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error loading plans.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlans();
  }, []);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const selectedPlanStops = useMemo(() => selectedPlan?.stops ?? [], [selectedPlan]);

  const handleCreateNew = async () => {
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
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error creating a plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSelected = async (stop: PlanStop) => {
    setSelectedStop(stop);
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
    setSelectedStop(null);
  }, [selectedPlanId]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Pathfinder</h1>
        <div className="app__profile">JH</div>
      </header>

      <div className="app__layout">
        <aside className="app__summary">
          <InfoPanel
            plan={selectedPlan}
            plans={plans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
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
                onCreateNew={handleCreateNew}
                isLoading={isLoading}
                onSelectStop={handleStopSelected}
                selectedStopLabel={selectedStop?.label}
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
