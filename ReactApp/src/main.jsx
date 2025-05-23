import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="610347828560-fm3p8n2j1poitjb4u7uvtht2knef5k55.apps.googleusercontent.com">
    <App />

    </GoogleOAuthProvider>
  </StrictMode>,
)
