import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './filterableProductTable.css'
import { App } from './FilterableProductTable.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
