import { useState, useContext, useEffect } from 'react'
import { SplitPaneContext } from './context'
import { NOOP } from './utils'

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: undefined
}

const useSpacer = (spacer: HTMLElement | null) => {
  const {
    isHorizontal,
    reversed,
    setSplitAt
  } = useContext(SplitPaneContext)

  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!spacer || setSplitAt === NOOP)
      return

    const { parentElement } = spacer

    if (!parentElement)
      return

    const computeSplitAt = (e: PointerEvent) => {
      const dimensions = parentElement.getBoundingClientRect()
      const position = isHorizontal ? e.clientY : e.clientX
      const offset = isHorizontal ? dimensions.top : dimensions.left
      const max = isHorizontal ? dimensions.height : dimensions.width
      let splitAt = position - offset
      if (splitAt < 0 || splitAt > max)
        return null
      if (reversed)
        splitAt = max - splitAt
      return ({
        splitAt,
        max
      })
    }

    let animationFrameRequest = -1
    let latestEvent: PointerEvent = null!
    let isDown = false

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0)
        return

      if (!isDown) {
        setIsDragging(isDown = true)
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        window.addEventListener('pointerup', onPointerUp, { passive: true, once: true })
        e.stopImmediatePropagation()
        e.preventDefault()
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (animationFrameRequest === -1)
        animationFrameRequest = requestAnimationFrame(() => {
          animationFrameRequest = -1
          const newSplitAt = computeSplitAt(latestEvent)
          if (newSplitAt !== null)
            setSplitAt(newSplitAt)
        })
      latestEvent = e
    }

    const onPointerUp = () => {
      setIsDragging(isDown = false)
      window.removeEventListener('pointermove', onPointerMove)
    }

    spacer.addEventListener('pointerdown', onPointerDown)

    return () => {
      cancelAnimationFrame(animationFrameRequest)
      spacer.removeEventListener('pointerdown', onPointerDown)
      if (isDown) {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        setIsDragging(false)
      }
    }
  }, [isHorizontal, reversed, setSplitAt, spacer])

  return isDragging
}

export const Spacer: React.FC<SpacerProps> = (props) => {
  const [el, setEl] = useState<HTMLElement | null>(null)

  const isDragging = useSpacer(el)

  return (
    <div
      {...props}
      ref={setEl}
      data-dragging={isDragging ? '' : undefined}
    />
  )
}
