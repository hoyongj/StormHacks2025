import { useState } from 'react';
import type { UserProfile } from '../App';
import './AdminPanel.css';

type AdminPanelProps = {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
};

const AdminPanel = ({ profile, onUpdateProfile }: AdminPanelProps) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setLocalProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onUpdateProfile(localProfile);
    setSaved(true);
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__avatar">{localProfile.name?.slice(0, 1) || 'U'}</div>
        <div className="admin__sidebar-info">
          <h2>{localProfile.name || 'Your name'}</h2>
          <p>{localProfile.email || 'Add contact email'}</p>
        </div>
      </aside>

      <main className="admin__content">
        <header className="admin__header">
          <div>
            <h1>Account Settings</h1>
            <p className="admin__subtitle">Update your information so teammates know who owns these plans.</p>
          </div>
          <button type="button" className="admin__save" onClick={handleSave}>
            Save changes
          </button>
        </header>

        <section className="admin__section">
          <h3>Basic Info</h3>
          <div className="admin__form-grid">
            <label className="admin__field">
              <span>Full name</span>
              <input
                type="text"
                value={localProfile.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className="admin__field">
              <span>Email</span>
              <input
                type="email"
                value={localProfile.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="admin__field admin__field--full">
              <span>Home base</span>
              <input
                type="text"
                value={localProfile.homeCity}
                onChange={(event) => handleChange('homeCity', event.target.value)}
                placeholder="City, Country"
              />
            </label>
          </div>
        </section>

        <section className="admin__section">
          <h3>Bio</h3>
          <label className="admin__field admin__field--full">
            <textarea
              rows={4}
              value={localProfile.bio ?? ''}
              onChange={(event) => handleChange('bio', event.target.value)}
              placeholder="Tell collaborators about your travel style, favourite routes, or planning preferences."
            />
          </label>
        </section>

        {saved ? <p className="admin__success">Profile saved ✓</p> : null}
      </main>
    </div>
  );
};

export default AdminPanel;
