import React, { useMemo, useReducer } from 'react'
import { SplitPaneContext, UpdateSizeAction } from './context'
import { NOOP } from './utils'

export type Orientation = 'horizontal' | 'vertical'

export interface SplitPaneProps extends React.HTMLAttributes<HTMLElement> {
  orientation: Orientation
  children: [JSX.Element, JSX.Element, JSX.Element]

  fixedPane?: 'first' | 'second'
  splitAt?: string | number
  defaultAt?: string | number
  onSplitAtChange?: SplitPaneContext['setSplitAt']
}

export const useSplitAt = (defaultSize: number | string, precision: number = 1) => useReducer(
  (state: number | string, action: UpdateSizeAction): typeof state => Math.max(
    0,
    Math.min(
      100,
      (((action.splitAt * 100 * precision) / action.max) | 0) / precision
    )
  ),
  defaultSize
)

export const SplitPane: React.FC<SplitPaneProps> = (props) => {
  const {
    splitAt: controlledSplitAt,
    defaultAt: defaultSize = controlledSplitAt ?? 50,
    onSplitAtChange: onSizeChange,
    orientation: orientation,
    fixedPane,
    children,
    ...elProps
  } = props

  const isHorizontal = orientation === 'horizontal'
  const reversed = fixedPane === 'second'

  const [splitAt, setSplitAt] = typeof controlledSplitAt === 'undefined'
    ? useSplitAt(defaultSize, 100)
    : [controlledSplitAt, onSizeChange ?? NOOP]

  const widthPx = typeof splitAt === 'string' ? splitAt : `${splitAt}%`

  const ctx = useMemo<SplitPaneContext>(() => ({
    isHorizontal,
    reversed,
    setSplitAt
  }), [isHorizontal, setSplitAt])

  return useMemo(() => (
    <SplitPaneContext.Provider value={ctx}>
      <div
        {...elProps}
        data-fixed={setSplitAt === NOOP ? '' : undefined}
        data-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        data-split-pane-container={''}
        style={{
          ...(elProps.style ?? {}),
          '--split-pane-at': widthPx
        } as any} // for custom properties
      >
        <div
          data-pane="first"
          data-primary={!reversed ? '' : undefined}
          style={{}}
        >
          {children[0]}
        </div>
        {children[1]}
        <div
          data-pane="second"
          data-primary={reversed ? '' : undefined}
        >
          {children[2]}
        </div>
      </div>
    </SplitPaneContext.Provider>
  ), [splitAt, orientation, reversed, ctx, props])
}
