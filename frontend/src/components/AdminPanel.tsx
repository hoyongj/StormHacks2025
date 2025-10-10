import { useEffect, useState } from "react";
import type { UserProfile } from "../App";
import "./AdminPanel.css";

type AdminPanelProps = {
    profile: UserProfile;
    onUpdateProfile: (updates: Partial<UserProfile>) => void;
};

const AdminPanel = ({ profile, onUpdateProfile }: AdminPanelProps) => {
    const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
    const [saved, setSaved] = useState(false);
    const [serverMsg, setServerMsg] = useState<string | null>(null);
    const [pwCurrent, setPwCurrent] = useState("");
    const [pwNew, setPwNew] = useState("");
    const [pwConfirm, setPwConfirm] = useState("");
    const [pwLoading, setPwLoading] = useState(false);

    const API_BASE: string =
        (import.meta.env as any).VITE_API_BASE_URL || "/api";

    useEffect(() => {
        // optional: load current identity
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        void (async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) return;
                const data = await res.json();
                // could map to UI later if needed
            } catch {}
        })();
    }, []);

    const handleChange = (field: keyof UserProfile, value: string) => {
        setLocalProfile((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        onUpdateProfile(localProfile);
        setSaved(true);
    };

    const handleSignOut = () => {
        localStorage.removeItem("auth_token");
        window.location.href = "/auth";
    };

    const handleChangePassword = async () => {
        setServerMsg(null);
        if (pwNew.length < 8) {
            setServerMsg("New password must be at least 8 characters.");
            return;
        }
        if (pwNew !== pwConfirm) {
            setServerMsg("Passwords do not match.");
            return;
        }
        const token = localStorage.getItem("auth_token");
        if (!token) {
            setServerMsg("You are not logged in.");
            return;
        }
        setPwLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: pwCurrent,
                    new_password: pwNew,
                }),
            });
            if (!res.ok) {
                let detail = "Failed to change password";
                try {
                    const err = await res.json();
                    detail = err.detail || JSON.stringify(err);
                } catch {}
                setServerMsg(detail);
                return;
            }
            setServerMsg("Password changed successfully.");
            setPwCurrent("");
            setPwNew("");
            setPwConfirm("");
        } catch (e) {
            setServerMsg(e instanceof Error ? e.message : "Unexpected error");
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <div className="admin">
            <aside className="admin__sidebar">
                <div className="admin__avatar">
                    {localProfile.name?.slice(0, 1) || "U"}
                </div>
                <div className="admin__sidebar-info">
                    <h2>{localProfile.name || "Your name"}</h2>
                    <p>{localProfile.email || "Add contact email"}</p>
                </div>
            </aside>

            <main className="admin__content">
                <header className="admin__header">
                    <div>
                        <h1>Account Settings</h1>
                        <p className="admin__subtitle">
                            Update your information so teammates know who owns
                            these plans.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="admin__save"
                        onClick={handleSave}
                    >
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
                                onChange={(event) =>
                                    handleChange("name", event.target.value)
                                }
                                placeholder="Your name"
                            />
                        </label>
                        <label className="admin__field">
                            <span>Email</span>
                            <input
                                type="email"
                                value={localProfile.email}
                                onChange={(event) =>
                                    handleChange("email", event.target.value)
                                }
                                placeholder="you@example.com"
                            />
                        </label>
                        {/* Home base removed per latest requirements */}
                    </div>
                </section>

                <section className="admin__section">
                        {/* Bio section removed per latest requirements */}
                </section>

                <section className="admin__section">
                    <h3>Security</h3>
                    <div className="admin__form-grid">
                        <label className="admin__field">
                            <span>Current password</span>
                            <input
                                type="password"
                                value={pwCurrent}
                                onChange={(e) => setPwCurrent(e.target.value)}
                                placeholder="••••••••"
                            />
                        </label>
                        <label className="admin__field">
                            <span>New password</span>
                            <input
                                type="password"
                                value={pwNew}
                                onChange={(e) => setPwNew(e.target.value)}
                                placeholder="At least 8 characters"
                            />
                        </label>
                        <label className="admin__field">
                            <span>Confirm new password</span>
                            <input
                                type="password"
                                value={pwConfirm}
                                onChange={(e) => setPwConfirm(e.target.value)}
                                placeholder="Repeat new password"
                            />
                        </label>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            className="admin__save"
                            type="button"
                            onClick={handleChangePassword}
                            disabled={pwLoading}
                        >
                            {pwLoading ? "Saving…" : "Change password"}
                        </button>
                        <button
                            className="admin__save"
                            type="button"
                            onClick={handleSignOut}
                        >
                            Sign out
                        </button>
                    </div>
                    {serverMsg ? (
                        <p className="admin__success" style={{ marginTop: 10 }}>
                            {serverMsg}
                        </p>
                    ) : null}
                </section>

                {saved ? (
                    <p className="admin__success">Profile saved ✓</p>
                ) : null}
            </main>
        </div>
    );
};

export default AdminPanel;
