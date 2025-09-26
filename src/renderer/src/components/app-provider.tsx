import { AppCtx, defaultValue } from '@renderer/hooks/use-app-ctx'
import { useMemo } from 'react'
import { useImmer } from 'use-immer'

export default function AppProvider(props): React.JSX.Element {
  const [app, setApp] = useImmer(defaultValue)

  const appCtxValue = useMemo(() => ({ ...app, setApp }), [app])
  return <AppCtx value={appCtxValue}>{props.children}</AppCtx>
}
