import React, { useMemo, useState } from "react";
import "./AuthPage.css";

// Prefer API_BASE_URL (proxied to backend under /api), fall back to explicit base if provided, else localhost.
const API_BASE: string =
    (import.meta.env as any).VITE_API_BASE_URL ||
    (import.meta.env as any).VITE_API_BASE ||
    "/api";

type PasswordScore = {
    score: number; // 0-4
    hints: string[];
    bytes: number;
};

function analyzePassword(pw: string): PasswordScore {
    const bytes = new TextEncoder().encode(pw).length;
    let score = 0;
    const hints: string[] = [];
    if (pw.length >= 8) score++;
    else hints.push("Use at least 8 characters");
    if (/[A-Z]/.test(pw)) score++;
    else hints.push("Add an uppercase letter");
    if (/[0-9]/.test(pw)) score++;
    else hints.push("Add a number");
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    else hints.push("Add a special character");
    return { score, hints, bytes };
}

const AuthPage: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const pwInfo = useMemo(() => analyzePassword(password), [password]);

    const handleRegister = async () => {
        setLoading(true);
        setServerError(null);
        try {
            // Derive first/last from full name (split by last space)
            const trimmed = fullName.trim();
            const parts = trimmed.split(/\s+/);
            const derivedFirst = parts.length > 1 ? parts.slice(0, -1).join(" ") : (parts[0] || email.split("@")[0] || "");
            const derivedLast = parts.length > 1 ? parts[parts.length - 1] : "";

            const res = await fetch(`${API_BASE}/auth/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    first_name: derivedFirst,
                    last_name: derivedLast,
                    password,
                }),
            });
            if (!res.ok) {
                let errDetail = "Registration failed";
                try {
                    const err = await res.json();
                    errDetail = err.detail || JSON.stringify(err);
                } catch (parseErr) {
                    const txt = await res.text();
                    errDetail = txt || `${res.status} ${res.statusText}`;
                }
                setServerError(errDetail);
                return;
            }
            // Success: store a local profile for this email so the main app can pick it up after login
            try {
                if (email) {
                    const profile = { name: trimmed || derivedFirst, email };
                    localStorage.setItem(`profile:${email}`, JSON.stringify(profile));
                }
            } catch {}

            setIsLogin(true);
        } catch (e) {
            setServerError(
                "Unexpected error during registration: " +
                    (e instanceof Error ? e.message : String(e))
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setServerError(null);
        try {
            const form = new URLSearchParams();
            form.append("username", email);
            form.append("password", password);

            const res = await fetch(`${API_BASE}/auth/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: form.toString(),
            });
            if (!res.ok) {
                let errDetail = "Login failed";
                try {
                    const err = await res.json();
                    errDetail = err.detail || JSON.stringify(err);
                } catch (parseErr) {
                    const txt = await res.text();
                    errDetail = txt || `${res.status} ${res.statusText}`;
                }
                setServerError(errDetail);
                return;
            }
            const data = await res.json();
            const token = data.access_token;
            localStorage.setItem("auth_token", token);
            window.location.href = "/";
        } catch (e) {
            setServerError(
                "Unexpected error during login: " +
                    (e instanceof Error ? e.message : String(e))
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) handleLogin();
        else handleRegister();
    };

    const canSubmit = useMemo(() => {
        if (!email || !password) return false;
        if (!isLogin) {
            // Basic password rules for registration
            if (password.length < 8) return false;
        }
        return true;
    }, [email, password, isLogin]);

    return (
        <div className="auth-root">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="branding">
                        <div className="logo">Pathfinder</div>
                        <p>Plan smart. Travel better.</p>
                    </div>
                    <ul className="benefits">
                        <li>Save and manage travel plans</li>
                        <li>AI suggestions for routes and stops</li>
                        <li>Fast, beautiful map visualizations</li>
                    </ul>
                </div>

                <div className="auth-right">
                    <div className="card">
                        <div className="tabs">
                            <button
                                className={isLogin ? "active" : ""}
                                onClick={() => setIsLogin(true)}
                                type="button"
                            >
                                Login
                            </button>
                            <button
                                className={!isLogin ? "active" : ""}
                                onClick={() => setIsLogin(false)}
                                type="button"
                            >
                                Register
                            </button>
                        </div>

                        {serverError && (
                            <div
                                className="alert"
                                role="alert"
                                aria-live="polite"
                            >
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="form">
                            {!isLogin && (
                                <div className="field">
                                    <label htmlFor="fullName">Full name</label>
                                    <input
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="James Hoang"
                                        autoComplete="name"
                                    />
                                </div>
                            )}

                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="field">
                                <div className="label-row">
                                    <label htmlFor="password">Password</label>
                                    {!isLogin && pwInfo.bytes > 72 && (
                                        <span className="warning">
                                            Large unicode password detected (
                                            {pwInfo.bytes} bytes). Consider
                                            shorter to avoid backend limits.
                                        </span>
                                    )}
                                </div>
                                <div className="password-row">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder={
                                            isLogin
                                                ? "Your password"
                                                : "Min 8 chars, mix recommended"
                                        }
                                        autoComplete={
                                            isLogin
                                                ? "current-password"
                                                : "new-password"
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="ghost"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                {!isLogin && (
                                    <div className="strength">
                                        <div
                                            className={`bar s${pwInfo.score}`}
                                        />
                                        <div className="hints">
                                            {pwInfo.hints.map((h) => (
                                                <span key={h}>{h}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                className="submit"
                                type="submit"
                                disabled={loading || !canSubmit}
                            >
                                {loading
                                    ? isLogin
                                        ? "Logging in…"
                                        : "Registering…"
                                    : isLogin
                                    ? "Login"
                                    : "Create account"}
                            </button>
                        </form>

                        <div className="switcher">
                            {isLogin ? (
                                <span>
                                    No account?{" "}
                                    <button
                                        type="button"
                                        className="link"
                                        onClick={() => setIsLogin(false)}
                                    >
                                        Register
                                    </button>
                                </span>
                            ) : (
                                <span>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        className="link"
                                        onClick={() => setIsLogin(true)}
                                    >
                                        Login
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
