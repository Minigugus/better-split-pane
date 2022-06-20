import { useEffect, useReducer, useRef } from 'react';
import { Orientation, Spacer, SplitPane, UpdateSizeAction } from '..';

import '../splitpane.css'
import './splitpanetest.css'

// const COLORS = [
//   'red',
//   'green',
//   'blue',
//   'yellow',
//   'orange',
//   'purple'
// ]

// const bezier = (n: number, a: number, b: number) => a * n + b * (1 - n)

// const processWidth = (size: number) => (
//   Math.max(25,
//     Math.min(75,
//       // 100 - ((size / 1) | 0) * 1
//       // (2 * size) % 100
//       size
//     )
//   )
// )

const getSize = (action: UpdateSizeAction, relative: boolean) =>
  !relative
    // ? `min(100%, ${action.size}px)`
    ? `max(50px, min(calc(100% - 50px), ${action.splitAt}px))`
    : Math.max(25, Math.min(75, (((action.splitAt * 10000) / action.max) | 0) / 100))

const SplittedPane = ({ orientation, children }: {
  orientation: Orientation
  children: [JSX.Element, JSX.Element]
}) => {
  const isRelative = useRef(Math.random() >= 0.25)
  const isFixed = useRef(Math.random() >= 0.8)
  const fixedPane = useRef(Math.random() >= 0.25)
  const animated = useRef(Math.random() >= 0.9)

  const [width, setWidth] = useReducer(
    (_: number | string, action: UpdateSizeAction) => getSize(action, isRelative.current),
    null,
    () => getSize({ splitAt: Math.random() * 500, max: 500 }, isRelative.current)
  )

  if (animated.current && isRelative.current)
    useEffect(() => {
      let animationFrameRequest = -1
      const render = (timestamp: number) => {
        const time = (timestamp % 10000) / 10000
        setWidth({ splitAt: Math.sin(2 * Math.PI * time) / 4 + 0.5, max: 1 })
        animationFrameRequest = requestAnimationFrame(render)
      }

      render(0)
      return () => cancelAnimationFrame(animationFrameRequest)
    }, [setWidth])

  return (
    <SplitPane
      splitAt={width}
      onSplitAtChange={isFixed.current ? undefined : setWidth}
      orientation={orientation}
      fixedPane={fixedPane.current ? 'second' : 'first'}
      className="split-pane-container"
      data-relative={isRelative.current ? '' : undefined}
    >
      {children[0]}
      <Spacer className="split-pane-spacer" />
      {children[1]}
    </SplitPane>
  )
}

const Box = ({ depth, left = 0 }: { depth: number, left?: number }) => depth <= 0 ? (
  <div
    className={`split-pane-test-container`}
    data-container={left / 2}
    style={{
      // width: '100%',
      // height: '100%',
      // backgroundColor: COLORS[(left / 2) % COLORS.length]
      backgroundColor: `hsl(${((left / 2) / (1 << 4)) * 360}deg 70% 40%)`
    }}
  >
    <p>Frame {left / 2}</p>
    {/* <input type="text" placeholder="Something" />
    <button>Frame {left / 2}</button> */}
  </div>
) : (
  <SplittedPane orientation={depth % 2 ? 'horizontal' : 'vertical'}>
    <Box depth={depth - 1} left={left} />
    <Box depth={depth - 1} left={left + (1 << depth)} />
  </SplittedPane >
)

export const SplitPaneTest = () => (
  <div
    style={{
      width: '100%',
      height: '100vh'
    }}
  >
    <Box depth={4} />
  </div>

)
