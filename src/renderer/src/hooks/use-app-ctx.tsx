import { createContext, useContext } from 'react'
import { Updater } from 'use-immer'


export type AppCtxProps = {
  step: string,
  path: string,
  unPackPath: string,
  setApp: Updater<AppCtxProps>
}

export const defaultValue: AppCtxProps = {
  step: 'one',
  path:'',
  unPackPath:'',
  setApp: () => {}
}

export const AppCtx = createContext<AppCtxProps>(defaultValue)

export const useAppCtx = () => {
  return useContext(AppCtx)
}
