/**
 * main.jsx
 * Application entry point for FF&E Hospitality Budget Manager
 * 
 * This file initializes the React application and mounts it to the DOM.
 * StrictMode is enabled to help identify potential problems in the application.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create root and render the application
// StrictMode enables additional development checks and warnings
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
