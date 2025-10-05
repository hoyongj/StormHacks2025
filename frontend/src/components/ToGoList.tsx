import React, { useState } from 'react';
import type { TravelPlan } from '../App';
import './ToGoList.css';

type ToGoListProps = {
  plan: TravelPlan | null;
  onCreateNew: () => void;
  isLoading: boolean;
};

<<<<<<< HEAD
function ToGoList({ plan, onCreateNew, isLoading }: ToGoListProps) {
=======
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

function ToGoList({ plan, onCreateNew }: ToGoListProps) {
>>>>>>> frame
  const stops = plan?.stops ?? [];
  const [showModal, setShowModal] = useState(false);
  const [planName, setPlanName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [startPlace, setStartPlace] = useState('');
  const [endPlace, setEndPlace] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [motivation, setMotivation] = useState<string[]>([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleMotivationToggle = (option: string) => {
    setMotivation(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNameClick = () => setEditingName(true);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setPlanName(e.target.value);
  const handleNameBlur = () => setEditingName(false);
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setEditingName(false);
  };

  return (
    <section className="to-go">
      <header className="to-go__header">
        <div className="to-go__header-row">
          <div>
            <p className="to-go__eyebrow">To Go</p>
            <h3>{plan ? 'Upcoming stops' : 'Pick a plan to see your route'}</h3>
          </div>
<<<<<<< HEAD
          <button type="button" className="info__create" onClick={onCreateNew} disabled={isLoading}>
            Generate Plan
=======
          <button type="button" className="info__create" onClick={handleOpenModal}>
            Create New Plan
>>>>>>> frame
          </button>
        </div>
      </header>

      <ol className="to-go__list">
        {isLoading ? (
          <li className="to-go__empty">Loading your stops…</li>
        ) : stops.length ? (
          stops.map((stop, index) => (
            <li key={stop.label + index}>
              <span className="to-go__step">{index + 1}</span>
              <div>
                <span className="to-go__title">{stop.label}</span>
                {stop.description ? <span className="to-go__desc">{stop.description}</span> : null}
              </div>
            </li>
          ))
        ) : (
          <li className="to-go__empty">Add stops to start crafting your day.</li>
        )}
      </ol>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__title">
              {editingName ? (
                <input
                  type="text"
                  value={planName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                  className="modal__title-input"
                  placeholder="Enter plan name..."
                />
              ) : (
                <span className="modal__title-text" onClick={handleNameClick}>
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
                    onClick={() => handleMotivationToggle(option)}
                    className={`modal__motivation-btn ${
                      motivation.includes(option) ? 'selected' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleCloseModal}>
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ToGoList;
