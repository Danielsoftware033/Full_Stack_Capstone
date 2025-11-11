import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NewsProvider } from './contexts/NewsContext.jsx'
import { ForumsProvider } from './contexts/ForumsContext.jsx'
import { ArticlesProvider } from './contexts/SavedArticlesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NewsProvider>
      <ForumsProvider>
        <ArticlesProvider>
          <App />
        </ArticlesProvider>
      </ForumsProvider>
    </NewsProvider>
  </StrictMode>,
)
