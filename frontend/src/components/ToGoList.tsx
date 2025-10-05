import React, { useState } from 'react';
import type { TravelPlan } from '../App';
import './ToGoList.css';


type ToGoListProps = {
  plan: TravelPlan | null;
  isLoading?: boolean;
  onSelectStop?: (stop: TravelPlan['stops'][number]) => void;
  selectedStopLabel?: string;
};

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

function ToGoList({ plan, isLoading = false, onSelectStop, selectedStopLabel }: ToGoListProps) {
  const stops = plan?.stops ?? [];
  return (
    <section className="to-go">
      <header className="to-go__header">
        <div className="to-go__header-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="to-go__eyebrow">To Go</p>
            <h3>{plan ? 'Upcoming stops' : 'Pick a plan to see your route'}</h3>
          </div>
          <button type="button" className="info__create">Save</button>
        </div>
      </header>
      <ol className="to-go__list">
        {isLoading ? (
          <li className="to-go__empty">Loading your stops…</li>
        ) : stops.length ? (
          stops.map((stop, index) => {
            const isSelected = selectedStopLabel === stop.label;
            return (
              <li key={stop.label + index} className={isSelected ? 'to-go__item to-go__item--selected' : 'to-go__item'}>
                <button type="button" onClick={() => onSelectStop?.(stop)}>
                  <span className="to-go__step">{index + 1}</span>
                  <div>
                    <span className="to-go__title">{stop.label}</span>
                    {stop.description ? <span className="to-go__desc">{stop.description}</span> : null}
                  </div>
                </button>
              </li>
            );
          })
        ) : (
          <li className="to-go__empty">Add stops to start crafting your day.</li>
        )}
      </ol>
    </section>
  );
}

export default ToGoList;
