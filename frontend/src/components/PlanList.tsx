import { TravelPlan } from '../App';
import './PlanList.css';

type PlanListProps = {
  plans: TravelPlan[];
  selectedPlanId: string;
  onSelect: (planId: string) => void;
};

function PlanList({ plans, selectedPlanId, onSelect }: PlanListProps) {
  if (!plans.length) {
    return <p className="plans__empty">No plans yet. Create one to get started.</p>;
  }

  return (
    <ul className="plans__list">
      {plans.map((plan) => (
        <li
          key={plan.id}
          className={plan.id === selectedPlanId ? 'plans__item plans__item--selected' : 'plans__item'}
        >
          <button type="button" onClick={() => onSelect(plan.id)}>
            <span className="plans__title">{plan.title}</span>
            <span className="plans__meta">{new Date(plan.createdAt).toLocaleString()}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default PlanList;
