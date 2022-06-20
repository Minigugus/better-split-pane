import { createContext } from 'react'
import { NOOP } from './utils'

export interface UpdateSizeAction {
  splitAt: number
  max: number
}

export interface SplitPaneContext {
  isHorizontal: boolean
  reversed: boolean
  setSplitAt: (action: UpdateSizeAction) => void
}

export const SplitPaneContext = createContext<SplitPaneContext>({
  isHorizontal: false,
  reversed: false,
  setSplitAt: NOOP
})
