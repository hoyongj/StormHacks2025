import { useEffect, useState } from 'react';
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

function App() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch('/api/plans');
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

  const handleCreateNew = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Plan a day exploring Burnaby around SFU.' })
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
              <ToGoList plan={selectedPlan} onCreateNew={handleCreateNew} isLoading={isLoading} />
            </div>
          </div>
          <TripAdvisor plan={selectedPlan} isLoading={isLoading} />
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
      longitude: stop.longitude
    }))
  };
}

export default App;
