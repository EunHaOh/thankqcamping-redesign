import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initPwaServiceWorker } from './lib/pwaRegister';
import { initViewportDebug } from './lib/viewportDebug';

initPwaServiceWorker();
initViewportDebug();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
