import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const AuthPage: React.FC = () => {
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName || name,
          last_name: lastName || '',
          password,
        }),
      });
      if (!res.ok) {
        let errDetail = 'Registration failed';
        try {
          const err = await res.json();
          errDetail = err.detail || JSON.stringify(err);
        } catch (parseErr) {
          const txt = await res.text();
          errDetail = txt || `${res.status} ${res.statusText}`;
        }
        console.error('Registration failed:', res.status, res.statusText, errDetail);
        alert(errDetail);
        return;
      }
      alert('Registration successful — you can now log in');
      setIsLogin(true);
    } catch (e) {
      console.error('Registration exception:', e);
      alert('Unexpected error during registration: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);

      const res = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || 'Login failed');
        return;
      }
      const data = await res.json();
      const token = data.access_token;
  localStorage.setItem('auth_token', token);
  alert('Login successful');
  window.location.href = '/';
    } catch (e) {
      console.error(e);
      alert('Unexpected error during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleRegister();
  };

  return (
    <div className="auth-page">
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div>
              <label htmlFor="firstName">First name</label>
              <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading}>{isLogin ? 'Login' : 'Register'}</button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
};

export default AuthPage;
