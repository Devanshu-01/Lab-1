import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReviewsProvider } from './context/ReviewsContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReviewsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReviewsProvider>
    </AuthProvider>
  </StrictMode>,
)
