import { createBrowserRouter } from 'react-router'
import Root from '@renderer/components/root'
import { lazy } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: lazy(() => import('@renderer/pages/home')) },
      { path: '/unpack', Component: lazy(() => import('@renderer/pages/unpack')) },
      { path: '/step-two', Component: lazy(() => import('@renderer/pages/step-two')) },
    ]
  }
])

export default router
