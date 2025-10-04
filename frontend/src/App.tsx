import { useState } from 'react';
import PlanList from './components/PlanList';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import PromptForm from './components/PromptForm';
import './App.css';

export type PlanStop = {
  label: string;
  description?: string;
};

export type TravelPlan = {
  id: string;
  title: string;
  summary: string;
  stops: PlanStop[];
  createdAt: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : '');
const API_ROOT = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

function App() {
  const [plans, setPlans] = useState<TravelPlan[]>(samplePlans);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(samplePlans[0]?.id ?? '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0] ?? null;

  const requestPlanSuggestions = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_ROOT}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to generate plan');
      }

      const data: TravelPlan = await response.json();
      setPlans((prev) => [data, ...prev]);
      setSelectedPlanId(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNew = () => {
    const timestamp = new Date().toISOString();
    const plan: TravelPlan = {
      id: `draft-${timestamp}`,
      title: 'Untitled Plan',
      summary: 'Describe your perfect day and we will fill this in.',
      stops: [],
      createdAt: timestamp
    };
    setPlans((prev) => [plan, ...prev]);
    setSelectedPlanId(plan.id);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Pathfinder</h1>
        <div className="app__profile">JH</div>
      </header>

      <div className="app__body">
        <aside className="app__plans">
          <div className="plans__header">
            <h2>Plans</h2>
            <button type="button" className="plans__create" onClick={handleCreateNew}>
              + Create New
            </button>
          </div>
          <PlanList plans={plans} selectedPlanId={selectedPlanId} onSelect={setSelectedPlanId} />
        </aside>

        <main className="app__main">
          <MapView plan={selectedPlan} />
          <PromptForm onSubmit={requestPlanSuggestions} isLoading={isGenerating} error={error} />
        </main>

        <aside className="app__info">
          <InfoPanel plan={selectedPlan} />
        </aside>
      </div>
    </div>
  );
}

const samplePlans: TravelPlan[] = [
  {
    id: 'sample-1',
    title: 'Seoul Street Food Day',
    summary: 'Morning markets, art alleys, and a sunset river cruise with snacks along the way.',
    stops: [
      { label: 'Gwangjang Market Breakfast', description: 'Start with bindaetteok and mayak kimbap.' },
      { label: 'Ikseon-dong Stroll', description: 'Cafés and artisan shops between sights.' },
      { label: 'Cheonggyecheon Walk', description: 'Relax by the stream before dinner.' },
      { label: 'Banpo Hangang Cruise', description: 'Catch the rainbow fountain at night.' }
    ],
    createdAt: new Date().toISOString()
  }
];

export default App;
