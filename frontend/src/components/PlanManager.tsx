import { useEffect, useMemo, useState } from 'react';
import type { Folder, TravelPlan } from '../App';
import './PlanManager.css';

type PlanManagerProps = {
  plans: TravelPlan[];
  folders: Folder[];
  onCreateFolder: (name: string) => string | null;
  onAssignPlan: (folderId: string, planId: string) => void;
  onRemovePlan: (folderId: string, planId: string) => void;
};

const PlanManager = ({ plans, folders, onCreateFolder, onAssignPlan, onRemovePlan }: PlanManagerProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id ?? 'all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!folders.length) {
      setSelectedFolderId('all');
      return;
    }
    if (!folders.some((folder) => folder.id === selectedFolderId)) {
      setSelectedFolderId(folders[0].id);
    }
  }, [folders, selectedFolderId]);

  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId) ?? folders[0];

  const filteredPlans = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const basePlans = selectedFolderId === 'all'
      ? plans
      : plans.filter((plan) => selectedFolder?.planIds.includes(plan.id));
    if (!term) {
      return basePlans;
    }
    return basePlans.filter((plan) =>
      plan.title.toLowerCase().includes(term) || plan.summary.toLowerCase().includes(term)
    );
  }, [plans, selectedFolderId, selectedFolder, searchTerm]);

  const availableFolders = useMemo(
    () => folders.filter((folder) => folder.id !== 'all'),
    [folders]
  );

  const handleAddFolder = () => {
    const name = prompt('Folder name');
    if (!name) {
      return;
    }
    const folderId = onCreateFolder(name);
    if (folderId) {
      setSelectedFolderId(folderId);
    }
  };

  return (
    <div className="manager">
      <aside className="manager__sidebar">
        <div className="manager__sidebar-header">
          <h2>Folders</h2>
          <button type="button" className="manager__add-folder" onClick={handleAddFolder}>
            + New Folder
          </button>
        </div>
        <ul className="manager__folder-list">
          {folders.map((folder) => {
            const count = folder.id === 'all' ? plans.length : folder.planIds.length;
            const isActive = folder.id === selectedFolderId;
            return (
              <li key={folder.id}>
                <button
                  type="button"
                  className={isActive ? 'manager__folder manager__folder--active' : 'manager__folder'}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <span>{folder.name}</span>
                  <span className="manager__folder-count">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="manager__main">
        <div className="manager__toolbar">
          <div>
            <h2>{selectedFolder?.name ?? 'Plans'}</h2>
            <p className="manager__hint">
              {selectedFolderId === 'all'
                ? 'Browse every itinerary you have saved.'
                : 'Manage which plans live in this folder.'}
            </p>
          </div>
          <input
            type="search"
            className="manager__search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search plans..."
          />
        </div>

        <div className="manager__plan-grid">
          {filteredPlans.length ? (
            filteredPlans.map((plan) => {
              const assignedFolders = availableFolders.filter((folder) => folder.planIds.includes(plan.id));
              const removable = selectedFolderId !== 'all' && assignedFolders.some((folder) => folder.id === selectedFolderId);
              const assignableFolders = availableFolders.filter((folder) => !folder.planIds.includes(plan.id));

              return (
                <article key={plan.id} className="manager__plan-card">
                  <header className="manager__plan-header">
                    <h3>{plan.title || 'Untitled Plan'}</h3>
                    <span className="manager__plan-date">{new Date(plan.createdAt).toLocaleDateString()}</span>
                  </header>
                  <p className="manager__plan-summary">{plan.summary || 'Add a short summary to describe this route.'}</p>
                  <div className="manager__plan-meta">
                    <span>{plan.stops.length} stops</span>
                  </div>
                  {assignedFolders.length ? (
                    <div className="manager__plan-tags">
                      {assignedFolders.map((folder) => (
                        <span key={folder.id} className="manager__plan-tag">
                          {folder.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="manager__plan-tags manager__plan-tags--empty">Unassigned</div>
                  )}
                  <div className="manager__plan-actions">
                    <select
                      className="manager__plan-select"
                      defaultValue=""
                      onChange={(event) => {
                        const folderId = event.target.value;
                        if (folderId) {
                          onAssignPlan(folderId, plan.id);
                          event.target.value = '';
                        }
                      }}
                    >
                      <option value="" disabled>
                        Add to folder…
                      </option>
                      {assignableFolders.length ? (
                        assignableFolders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No available folders
                        </option>
                      )}
                    </select>
                    <button
                      type="button"
                      className="manager__plan-remove"
                      disabled={!removable}
                      onClick={() => removable && onRemovePlan(selectedFolderId, plan.id)}
                    >
                      Remove from folder
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="manager__empty">
              {searchTerm
                ? 'No plans match your search in this folder.'
                : 'No plans in this folder yet.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlanManager;
