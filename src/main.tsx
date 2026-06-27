import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler to suppress cross-origin third-party/extension "Script error" noises
if (typeof window !== 'undefined') {
  const handleScriptError = (message: any) => {
    if (
      message === 'Script error.' || 
      (typeof message === 'string' && message.includes('Script error'))
    ) {
      console.warn('[IQ200-SYSTEM] Suppressed non-actionable third-party or cross-origin Script error.');
      return true; // Suppress error propagation
    }
    return false;
  };

  const prevOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (handleScriptError(message)) {
      return true;
    }
    if (prevOnError) {
      return prevOnError.apply(this, arguments as any);
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (handleScriptError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && handleScriptError(reason.message)) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

