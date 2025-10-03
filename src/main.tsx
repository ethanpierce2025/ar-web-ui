import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserStorage } from './utils/storage';

BrowserStorage.getOrGenerateClientId();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
