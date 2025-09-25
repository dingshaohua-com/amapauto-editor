import { useMemo } from 'react'
import { match } from 'ts-pattern'
import { useImmer } from 'use-immer'
import { defaultValue, AppCtx } from './hooks/use-app-ctx'
import StepOne from './components/step-one'
import StepTwo from './components/step-two'

export default function App(): React.JSX.Element {
  const [app, setApp] = useImmer(defaultValue)

  const appCtxValue = useMemo(() => ({ ...app, setApp }), [app])

  return (
    <AppCtx value={appCtxValue}>
      <>
        {match(app.step)
          .with('one', () => <StepOne/>)
          .with('two', () => <StepTwo/>)
          .otherwise(() => null)}
      </>
    </AppCtx>
  )
}
