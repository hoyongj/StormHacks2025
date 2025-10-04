import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

autoResizeViewport();

function autoResizeViewport() {
  if (import.meta.env.DEV) {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
