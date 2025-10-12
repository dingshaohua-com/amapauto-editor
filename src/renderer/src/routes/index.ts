import { createBrowserRouter } from 'react-router'
import Root from '@renderer/components/root'
import { lazy } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: lazy(() => import('@renderer/pages/home')) },
      { path: '/unpack-app', Component: lazy(() => import('@renderer/pages/unpack-app')) },
      { path: '/edit-app', Component: lazy(() => import('@renderer/pages/edit-app')) },
      { path: '/sign-app', Component: lazy(() => import('@renderer/pages/sign-app')) },
      { path: '/patch-app', Component: lazy(() => import('@renderer/pages/patch-app')) },
      { path: '/pack-app', Component: lazy(() => import('@renderer/pages/pack-app')) },
    ]
  }
])

export default router
