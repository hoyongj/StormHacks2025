import './AiAssistantPanel.css';

function AiAssistantPanel() {
  return (
    <aside className="assistant">
      <p className="assistant__eyebrow">AI Assist</p>
      <h3>Travel Coach</h3>
      <p>
        Need fresh ideas? Soon you will be able to ask our AI for dining detours, scenic stops, and
        day plans tailored to your vibe.
      </p>
      <div className="assistant__card">
        <p>Try prompts like:</p>
        <ul>
          <li>“Find sunset views near the next stop.”</li>
          <li>“Add a brunch cafe before noon.”</li>
          <li>“Keep travel time under 20 minutes.”</li>
        </ul>
      </div>
      <button type="button" className="assistant__cta" disabled>
        Chat Preview Soon
      </button>
    </aside>
  );
}

export default AiAssistantPanel;
