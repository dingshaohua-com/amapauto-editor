import './assets/styles/main.css'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import router from './routes'
import AppProvider from './components/app-provider'

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
)
