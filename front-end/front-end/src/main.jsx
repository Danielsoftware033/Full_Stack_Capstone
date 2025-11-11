import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NewsProvider } from './contexts/NewsContext.jsx'
import { ForumsProvider } from './contexts/ForumsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NewsProvider>
      <ForumsProvider>
        <App />
      </ForumsProvider>
    </NewsProvider>
  </StrictMode>,
)
