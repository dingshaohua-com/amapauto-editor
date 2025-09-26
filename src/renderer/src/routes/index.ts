import { createBrowserRouter } from 'react-router'
import Root from '@renderer/components/root'
import { lazy } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [{ index: true, Component: lazy(() => import('@renderer/pages/home')) }]
  }
])

export default router
