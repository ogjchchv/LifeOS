import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LifeProvider } from './context/LifeContext.tsx';

// Suppress Recharts ResizeObserver/zero-dimension warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('The width') && args[0].includes('chart should be greater than 0')) {
    return;
  }
  originalConsoleWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LifeProvider>
      <App />
    </LifeProvider>
  </StrictMode>,
);
