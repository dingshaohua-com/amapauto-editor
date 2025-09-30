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
      { path: '/edit-pack', Component: lazy(() => import('@renderer/pages/edit-pack')) },
      { path: '/re-sign', Component: lazy(() => import('@renderer/pages/re-sign')) },
    ]
  }
])

export default router
