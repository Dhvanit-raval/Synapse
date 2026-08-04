import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applySynapsePreferences } from './utils/preferences.js'
import './index.css'
import App from './App.jsx'

applySynapsePreferences();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
