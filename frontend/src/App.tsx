import { useState } from 'react';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import TripAdvisor from './components/TripAdvisor';
import AiAssistantPanel from './components/AiAssistantPanel';
import './App.css';

export type PlanStop = {
  label: string;
  description?: string;
  placeId?: string;
};

export type TravelPlan = {
  id: string;
  title: string;
  summary: string;
  stops: PlanStop[];
  createdAt: string;
};

function App() {
  const [plans, setPlans] = useState<TravelPlan[]>(samplePlans);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(samplePlans[0]?.id ?? '');
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0] ?? null;

  const handleCreateNew = () => {
    const timestamp = new Date().toISOString();
    const plan: TravelPlan = {
      id: `draft-${timestamp}`,
      title: 'Untitled Plan',
      summary: 'Describe your perfect day and we will fill this in.',
      stops: [
        {
          label: 'Simon Fraser University',
          description: 'Default starting point—add nearby cafes, hikes, or classes to build your day.'
        }
      ],
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

      <div className="app__layout">
        <aside className="app__summary">
          <InfoPanel
            plan={selectedPlan}
            plans={plans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
            onCreateNew={handleCreateNew}
          />
        </aside>

        <section className="app__content">
          <div className="app__map">
            <MapView plan={selectedPlan} />
          </div>
          <TripAdvisor plan={selectedPlan} />
        </section>

        <aside className="app__assistant">
          <AiAssistantPanel />
        </aside>
      </div>
    </div>
  );
}

const samplePlans: TravelPlan[] = [
  {
    id: 'sample-sfu',
    title: 'Simon Fraser University Day',
    summary: 'Explore the Burnaby Mountain campus with study spots, coffee breaks, and scenic viewpoints.',
    stops: [
      {
        label: 'Simon Fraser University',
        description: 'Meet at the AQ and take in the Arthur Erickson architecture around Freedom Square.'
      },
      {
        label: 'Strand Hall Coffee',
        description: 'Grab a latte before exploring the upper campus gardens.'
      },
      {
        label: 'Burnaby Mountain Park Lookout',
        description: 'Walk to the Kamui Mintara totems and catch the Burrard Inlet views.'
      },
      {
        label: 'Convocation Mall',
        description: 'Wrap up under the iconic canopy—perfect for photos and group meetups.'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export default App;
